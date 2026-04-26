import { wait } from "@trigger.dev/sdk/v3";

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Please provide a token");
    process.exit(1);
  }

  await wait.completeToken(token, {
    status: "approved",
    comment: "Looks good to me!"
  });

  console.log(`Successfully approved token ${token}`);
}

main().catch(console.error);
