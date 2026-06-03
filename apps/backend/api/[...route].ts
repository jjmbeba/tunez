import { handle } from "@hono/node-server/vercel";
import app from "../src/app.js";

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
