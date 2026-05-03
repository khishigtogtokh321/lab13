const REQUIRED_PRODUCTION_ENV = [
  "DATABASE_URL",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "PORT"
];

export function loadConfig(env = process.env) {
  const missing = REQUIRED_PRODUCTION_ENV.filter((key) => !env[key]);
  const port = Number(env.PORT ?? 4000);

  if (env.NODE_ENV === "production" && missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer.");
  }

  return {
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
    adminEmail: env.ADMIN_EMAIL,
    adminPassword: env.ADMIN_PASSWORD,
    port
  };
}

export const config = loadConfig();
