import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { isProductionRuntime } from "../lib/env.js";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(sourceDir, "..", "..");
const localDatabasePath = resolve(backendRoot, "data", "tunez.db");
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;
const useLocalDatabase = !tursoUrl && !isProductionRuntime();

if (useLocalDatabase) {
  mkdirSync(dirname(localDatabasePath), { recursive: true });
}

if (!useLocalDatabase) {
  if (!tursoUrl) {
    throw new Error("TURSO_DATABASE_URL is required outside development/test local mode.");
  }

  if (!tursoAuthToken) {
    throw new Error("TURSO_AUTH_TOKEN is required when TURSO_DATABASE_URL is set.");
  }
}

const client = createClient({
  url: useLocalDatabase ? `file:${localDatabasePath}` : tursoUrl!,
  authToken: useLocalDatabase ? undefined : tursoAuthToken,
});

export const db = drizzle(client);
export { client as dbClient };
