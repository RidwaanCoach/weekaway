// Creates the WeekAway tables on a Turso database.
// Usage: set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN, then:
//   npx tsx scripts/turso-push-schema.ts
import { execSync } from "child_process";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
  console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN first.");
  process.exit(1);
}

const ddl = execSync(
  "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
  { encoding: "utf8" }
);

const client = createClient({ url, authToken });
client
  .executeMultiple(ddl)
  .then(() => {
    console.log("Schema created on Turso.");
    client.close();
  })
  .catch((e) => {
    console.error(e);
    client.close();
    process.exit(1);
  });
