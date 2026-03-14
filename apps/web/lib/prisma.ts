// Prisma client helper for API routes
// Re-exports the shared Prisma client from @freelancehigh/db
// Use IS_DEV to branch between dev-store (JSON files) and Prisma (production DB)

export { prisma, default as default } from "@freelancehigh/db";

export const IS_DEV = process.env.DEV_MODE === "true";
