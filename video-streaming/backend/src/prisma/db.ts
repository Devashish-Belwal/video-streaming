import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

const rawUrl = process.env["DATABASE_URL"] ?? "";
const url = rawUrl.replace(/^["']|["']$/g, "");
const adapter = new PrismaPg({
  connectionString: url,
});

export const db = new PrismaClient({ adapter });
