import { tasks } from "@trigger.dev/sdk/v3";
import { screenshotTask } from "./src/trigger/screenshot";

async function main() {
  const run = await tasks.trigger<typeof screenshotTask>(
    screenshotTask.id,
    { url: "https://example.com" }
  );
  console.log(`Run ID: ${run.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
