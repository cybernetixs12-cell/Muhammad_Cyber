import "dotenv/config";

export interface AppConfig {
  databaseUrl: string;
  port: number;
  frontendUrl: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }
  return {
    databaseUrl: required("DATABASE_URL"),
    port,
    frontendUrl: required("FRONTEND_URL"),
  };
}
