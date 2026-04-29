import { tasks } from "@trigger.dev/sdk/v3";

const handle = await tasks.trigger(
  "python-process-python_extension_data_processing__Yr7hHHQ",
  {
    numbers: [10, 20, 30, 40, 50],
  }
);

console.log(`Run ID: ${handle.id}`);
