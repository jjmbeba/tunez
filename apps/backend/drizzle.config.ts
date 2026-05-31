import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { isProductionRuntime } from "./src/lib/env.js";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const isProduction = isProductionRuntime();

export default defineConfig(
  tursoUrl
    ? {
        dialect: "turso",
        schema: "./src/db/schema.ts",
        out: "./src/db/migrations",
        dbCredentials: {
          url: tursoUrl,
          authToken: process.env.TURSO_AUTH_TOKEN ?? "",
        },
      }
    : isProduction
      ? (() => {
          throw new Error("TURSO_DATABASE_URL is required for production Drizzle operations.");
        })()
    : {
        dialect: "sqlite",
        schema: "./src/db/schema.ts",
        out: "./src/db/migrations",
        dbCredentials: {
          url: "file:./data/tunez.db",
        },
      },
);
