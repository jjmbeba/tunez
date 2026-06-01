import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { isProductionRuntime } from "./src/lib/env.js";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;
const isProduction = isProductionRuntime();

export default defineConfig(
  tursoUrl
    ? (() => {
        if (!tursoAuthToken) {
          throw new Error("TURSO_AUTH_TOKEN is required when TURSO_DATABASE_URL is set.");
        }

        return {
          dialect: "turso",
          schema: "./src/db/schema.ts",
          out: "./src/db/migrations",
          dbCredentials: {
            url: tursoUrl,
            authToken: tursoAuthToken,
          },
        };
      })()
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
