import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  console.log("Starting trigger...");
  try {
    const result = await tasks.trigger("python-process-python_extension_data_processing__8EuGDoG", [10, 20, 30, 40, 50]);
    console.log(`Run ID: ${result.id}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
