import path from "node:path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  ...(process.env.DATABASE_URL
    ? { datasource: { url: process.env.DATABASE_URL } }
    : {}),
})
