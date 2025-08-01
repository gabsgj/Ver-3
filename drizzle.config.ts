import { defineConfig } from "drizzle-kit";

// For development, allow missing DATABASE_URL (will use in-memory storage)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL is required in production. Please ensure the database is provisioned.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl || "postgresql://dummy:dummy@localhost:5432/dummy",
  },
});
