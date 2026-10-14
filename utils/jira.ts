/// <reference types="node" />
import dotenv from "dotenv";

dotenv.config({ quiet: true });

// ---------- Types ----------

export interface AdfNode {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: AdfNode[];
  marks?: unknown[];
  version?: number;
}

export interface AdfDocument extends AdfNode {
  type: "doc";
  version: 1;
  content: AdfNode[];
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: AdfDocument | null;
    labels: string[];
    status: { name: string; [key: string]: unknown };
  };
}

interface JiraTransition {
  id: string;
  name: string;
  to?: { name: string };
}

export class JiraError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "JiraError";
  }
}

// ---------- HTTP ----------

function config() {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  const missing = Object.entries({ JIRA_BASE_URL: baseUrl, JIRA_EMAIL: email, JIRA_API_TOKEN: token })
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length) {
    throw new Error(`Missing env variable(s) ${missing.join(", ")}. Check .env`);
  }
  return {
    baseUrl: baseUrl!.replace(/\/+$/, ""),
    auth: `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`,
  };
}

function formatJiraError(body: unknown): string {
  if (body && typeof body === "object") {
    const { errorMessages, errors, message } = body as {
      errorMessages?: string[];
      errors?: Record<string, string>;
      message?: string;
    };
    const parts = [
      ...(errorMessages ?? []),
      ...Object.entries(errors ?? {}).map(([field, msg]) => `${field}: ${msg}`),
    ];
    if (message) parts.push(message);
    if (parts.length) return parts.join("; ");
  }
  return typeof body === "string" && body ? body : "No error message returned";
}

async function jiraRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { baseUrl, auth } = config();
  const url = `${baseUrl}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: auth,
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    console.log(`${method} ${url} -> network error`);
    throw new Error(`Request to Jira failed: ${(error as Error).message}`);
  }

  console.log(`${method} ${url} -> ${response.status}`);

  const text = await response.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    // Non-JSON body (e.g. an HTML error page); keep the raw text
  }

  if (!response.ok) {
    throw new JiraError(`Jira ${method} ${path} failed with HTTP ${response.status}: ${formatJiraError(data)}`, response.status);
  }
  return data as T;
}

// ---------- ADF ----------

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "blockquote",
  "codeBlock",
  "panel",
  "rule",
  "table",
  "tableRow",
  "mediaSingle",
  "mediaGroup",
]);

function adfToText(node: AdfNode, listPrefix = ""): string {
  switch (node.type) {
    case "text":
      return node.text ?? "";
    case "hardBreak":
      return "\n";
    case "mention":
    case "emoji":
      return String(node.attrs?.text ?? node.attrs?.shortName ?? "");
    case "inlineCard":
    case "blockCard":
      return String(node.attrs?.url ?? "");
    case "rule":
      return "\n---\n";
    case "bulletList":
    case "orderedList": {
      const items = node.content ?? [];
      const start = Number(node.attrs?.order ?? 1);
      return (
        items
          .map((item, i) => {
            const marker = node.type === "orderedList" ? `${start + i}. ` : "- ";
            return adfToText(item, marker).trimEnd();
          })
          .join("\n") + "\n\n"
      );
    }
    case "listItem": {
      // listPrefix is the item marker; continuation lines (incl. nested lists) are indented under it
      const indent = " ".repeat(listPrefix.length);
      const inner = cleanText((node.content ?? []).map((child) => adfToText(child)).join("")).replace(/\n{2,}/g, "\n");
      return `${listPrefix}${inner.replace(/\n/g, `\n${indent}`)}\n`;
    }
    case "tableCell":
    case "tableHeader":
      return (node.content ?? []).map((child) => adfToText(child)).join("").trim() + "\t";
  }

  const inner = (node.content ?? []).map((child) => adfToText(child)).join("");
  return BLOCK_TYPES.has(node.type) ? `${inner.trimEnd()}\n\n` : inner;
}

function cleanText(text: string): string {
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function textToParagraph(text: string): AdfNode {
  const lines = text.split(/\r?\n/);
  const content: AdfNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) content.push({ type: "hardBreak" });
    if (line) content.push({ type: "text", text: line });
  });
  return { type: "paragraph", content };
}

// ---------- Public API ----------

export async function getTodoTasks(projectKey: string): Promise<JiraIssue[]> {
  const jql = `project = "${projectKey.replace(/"/g, '\\"')}" AND status = "To Do" ORDER BY created ASC`;
  const issues: JiraIssue[] = [];
  let nextPageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      jql,
      fields: "summary,description,labels,status",
      maxResults: "100",
    });
    if (nextPageToken) params.set("nextPageToken", nextPageToken);

    const page = await jiraRequest<{ issues: JiraIssue[]; nextPageToken?: string; isLast?: boolean }>(
      "GET",
      `/rest/api/3/search/jql?${params}`,
    );
    issues.push(...page.issues);
    nextPageToken = page.isLast === false ? page.nextPageToken : undefined;
  } while (nextPageToken);

  return issues;
}

async function getDescriptionAdf(issueKey: string): Promise<AdfDocument | null> {
  const issue = await jiraRequest<JiraIssue>(
    "GET",
    `/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=description`,
  );
  return issue.fields.description ?? null;
}

export async function getTaskDescription(issueKey: string): Promise<string> {
  const description = await getDescriptionAdf(issueKey);
  return description ? cleanText(adfToText(description)) : "";
}

export async function getTaskLabels(issueKey: string): Promise<string[]> {
  const issue = await jiraRequest<JiraIssue>(
    "GET",
    `/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=labels`,
  );
  return issue.fields.labels ?? [];
}

export async function moveTask(issueKey: string, transitionName: string): Promise<void> {
  const path = `/rest/api/3/issue/${encodeURIComponent(issueKey)}/transitions`;
  const { transitions } = await jiraRequest<{ transitions: JiraTransition[] }>("GET", path);

  const wanted = transitionName.trim().toLowerCase();
  const transition =
    transitions.find((t) => t.name.toLowerCase() === wanted) ??
    transitions.find((t) => t.to?.name.toLowerCase() === wanted);

  if (!transition) {
    const available = transitions.map((t) => `"${t.name}"${t.to ? ` (→ ${t.to.name})` : ""}`).join(", ");
    throw new Error(
      `No transition "${transitionName}" for ${issueKey}. Available transitions: ${available || "none"}`,
    );
  }

  await jiraRequest<void>("POST", path, { transition: { id: transition.id } });
  console.log(`${issueKey}: transition "${transition.name}"${transition.to ? ` → ${transition.to.name}` : ""}`);
}

export async function updateDescription(issueKey: string, appendText: string): Promise<void> {
  if (!appendText.trim()) {
    throw new Error("Text to append must not be empty");
  }

  const current = await getDescriptionAdf(issueKey);
  const paragraph = textToParagraph(appendText);
  const description: AdfDocument = current
    ? { ...current, content: [...(current.content ?? []), paragraph] }
    : { type: "doc", version: 1, content: [paragraph] };

  await jiraRequest<void>("PUT", `/rest/api/3/issue/${encodeURIComponent(issueKey)}`, {
    fields: { description },
  });
  console.log(`${issueKey}: description updated`);
}

// ---------- CLI ----------

const USAGE = `Usage:
  npx tsx utils/jira.ts todo <PROJECT_KEY>
  npx tsx utils/jira.ts get <ISSUE_KEY>
  npx tsx utils/jira.ts move <ISSUE_KEY> "<Transition name>"
  npx tsx utils/jira.ts append <ISSUE_KEY> "<Text>"`;

async function main(args: string[]): Promise<void> {
  const [command, key, ...rest] = args;
  const text = rest.join(" ");

  if (!command || !key) throw new Error(USAGE);

  switch (command) {
    case "todo": {
      const issues = await getTodoTasks(key);
      if (!issues.length) {
        console.log(`No "To Do" issues in ${key}`);
        return;
      }
      for (const issue of issues) {
        const labels = issue.fields.labels.length ? ` [${issue.fields.labels.join(", ")}]` : "";
        console.log(`${issue.key}  ${issue.fields.status.name}  ${issue.fields.summary}${labels}`);
      }
      return;
    }
    case "get": {
      const labels = await getTaskLabels(key);
      console.log(`Labels: ${labels.length ? labels.join(", ") : "(none)"}\n`);
      console.log(await getTaskDescription(key));
      return;
    }
    case "move":
      if (!text) throw new Error(USAGE);
      await moveTask(key, text);
      return;
    case "append":
      if (!text) throw new Error(USAGE);
      await updateDescription(key, text);
      return;
    default:
      throw new Error(`Unknown command "${command}"\n${USAGE}`);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((error: Error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}
