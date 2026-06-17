// Run with: node scripts/make-admin.mjs prajwalkawasaki@gmail.com
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/make-admin.mjs <email>");
  process.exit(1);
}

const user = await prisma.user.upsert({
  where: { email },
  create: { email, name: email, role: "ADMIN" },
  update: { role: "ADMIN" },
  select: { id: true, email: true, name: true, role: true },
});

console.log("✅ Done!", user);
await prisma.$disconnect();
