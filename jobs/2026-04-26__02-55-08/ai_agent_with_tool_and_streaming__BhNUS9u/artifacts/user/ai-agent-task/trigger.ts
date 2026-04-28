import { tasks, streams } from "@trigger.dev/sdk";
import fs from "fs";

const trial_id = fs.readFileSync("/logs/trial_id", "utf-8").trim();

async function main() {
  const run = await tasks.trigger(`agentTask-${trial_id}`, {
    city: "Paris",
  });

  console.log("Stream output:");
  const stream = await streams.read(run.id, "ai-output");

  if (!stream) {
    console.log("Stream not found. Waiting for run to finish...");
    let result = await tasks.retrieve(run.id);
    while (result.status === "PENDING" || result.status === "EXECUTING" || result.status === "WAITING") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await tasks.retrieve(run.id);
    }
    console.log("Run Status:", result.status);
    if (result.status === "FAILED") {
      console.log("Error:", JSON.stringify(result.error, null, 2));
    } else {
      console.log("Output:", JSON.stringify(result.output, null, 2));
    }
  } else {
    for await (const chunk of stream) {
      process.stdout.write(chunk);
    }
  }
  console.log("\n");
  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);
