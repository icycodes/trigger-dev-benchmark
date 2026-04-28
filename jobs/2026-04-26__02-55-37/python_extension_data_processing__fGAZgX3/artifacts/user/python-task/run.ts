import { tasks } from "@trigger.dev/sdk";

async function main() {
  const result = await tasks.trigger("python-process-python_extension_data_processing__fGAZgX3", [10, 20, 30, 40, 50]);
  console.log(`Run ID: ${result.id}`);
}

main().catch(console.error);
