const defaultTrustedOrigins = ["http://localhost:5173"];

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export function getTrustedOrigins(value = process.env.BETTER_AUTH_TRUSTED_ORIGINS): string[] {
  const parsed = value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (parsed && parsed.length > 0) {
    return parsed;
  }

  if (isProductionRuntime()) {
    throw new Error("getTrustedOrigins requires BETTER_AUTH_TRUSTED_ORIGINS in production.");
  }

  return defaultTrustedOrigins;
}

export function isProductionRuntime(nodeEnv = process.env.NODE_ENV): boolean {
  return nodeEnv === "production";
}
