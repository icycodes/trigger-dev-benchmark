import { client } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

client.init({
  id: "python-task",
});

export const pythonProcessPython_extension_data_processing__cZNRRFD = client.defineJob({
  id: "python-process-python_extension_data_processing__cZNRRFD",
  name: "Python Process Data",
  version: "1.0.0",
  trigger: client.manualTrigger({
    type: "schema",
    schema: {
      type: "object",
      properties: {
        numbers: {
          type: "array",
          items: { type: "number" },
        },
      },
      required: ["numbers"],
    },
  }),
  run: async (payload, io, ctx) => {
    const result = await python.runScript(io, "process", "./scripts/process.py", payload.numbers.map(String));

    // Parse the output to extract the average value
    const match = result.stdout.match(/Average: ([\d.]+)/);
    const average = match ? parseFloat(match[1]) : null;

    return {
      average,
    };
  },
});