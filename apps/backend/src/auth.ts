import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { db } from "./db/index.js";
import { account, session, user, verification } from "./db/auth-schema.js";
import { getRequiredEnv, getTrustedOrigins } from "./lib/env.js";

export const auth = betterAuth({
  baseURL: getRequiredEnv("BETTER_AUTH_URL"),
  secret: getRequiredEnv("BETTER_AUTH_SECRET"),
  trustedOrigins: getTrustedOrigins(),
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  plugins: [anonymous()],
});
