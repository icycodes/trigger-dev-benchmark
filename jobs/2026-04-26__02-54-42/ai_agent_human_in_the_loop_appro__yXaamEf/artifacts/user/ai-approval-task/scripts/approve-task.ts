import { configure, wait } from "@trigger.dev/sdk/v3";

const token = process.argv[2];

if (!token) {
  console.error("Usage: npm run approve-task <token>");
  process.exit(1);
}

const accessToken = process.env.TRIGGER_SECRET_KEY;

if (!accessToken) {
  throw new Error("TRIGGER_SECRET_KEY is required to approve tasks.");
}

configure({
  accessToken,
  baseURL: process.env.TRIGGER_API_URL,
});

async function run() {
  await wait.completeToken(token, {
    approved: true,
    approvedAt: new Date().toISOString(),
  });

  console.log(`Approved token: ${token}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
