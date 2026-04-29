import { wait } from "@trigger.dev/sdk";

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Please provide a token as an argument.");
    process.exit(1);
  }

  await wait.completeToken(token, { approved: true });
  console.log(`Token ${token} completed with approved: true`);
}

main().catch(console.error);
