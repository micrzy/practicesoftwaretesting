// Blocks Claude from reading or writing .env (secrets).
// .env.local / .env.staging / .env.dev only hold URLs and stay allowed.
let input = "";
process.stdin.on("data", (chunk) => (input += chunk)).on("end", () => {
  const { tool_input = {} } = JSON.parse(input);
  const target = [tool_input.file_path, tool_input.path, tool_input.command, tool_input.glob]
    .filter(Boolean)
    .join(" ");

  if (/(^|[\s\/\\'"=])\.env(?![\w.-])/.test(target)) {
    console.error("Blocked: .env holds secrets and is off-limits to Claude.");
    process.exit(2);
  }
});