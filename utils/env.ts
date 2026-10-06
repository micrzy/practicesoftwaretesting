/// <reference types="node" />

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable ${name}. Check .env.${process.env.ENV || "dev"}`);
  }
  return value;
}

export const API_URL = required("API_URL");
