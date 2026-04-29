import { tasks, wait } from "@trigger.dev/sdk";

async function main() {
  const token = await wait.createToken();
  console.log(`Token: ${token.id}`);
}

main().catch(console.error);
