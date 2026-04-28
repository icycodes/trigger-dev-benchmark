import { client } from "@trigger.dev/sdk/v3";
import { screenshotTask } from "./src/trigger/screenshot";

async function main() {
  const run = await client.trigger(screenshotTask, {
    url: "https://example.com"
  });

  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);