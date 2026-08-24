// Seeds whichever database src/lib/db.ts points at:
// local SQLite by default, Turso when TURSO_* env vars are set.
import { prisma } from "../src/lib/db";
import { seedDemoData } from "../src/lib/demo-seed";

seedDemoData(prisma)
  .then((r) => {
    console.log(`Seeded ${r.resorts} resorts, ${r.agents} agents, ${r.listings} listings.`);
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
