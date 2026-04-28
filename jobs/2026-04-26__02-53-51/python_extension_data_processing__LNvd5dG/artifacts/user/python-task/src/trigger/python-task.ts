import { client } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

client.defineJob({
  id: `python-process-python_extension_data_processing__LNvd5dG`,
  name: "Python Process Task",
  version: "1.0.0",
  trigger: client.eventTrigger({
    name: "python.process",
    schema: {
      type: "object",
      properties: {
        numbers: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
      required: ["numbers"],
    },
  }),
  run: async (event, ctx) => {
    const { numbers } = event;

    // Execute the Python script with the numbers as arguments
    const result = await python.runScript("./scripts/process.py", numbers.map(String));

    // Parse the output to extract the average value
    const output = result.stdout.trim();
    const match = output.match(/Average: ([\d.]+)/);

    if (!match) {
      throw new Error(`Failed to parse output: ${output}`);
    }

    const average = parseFloat(match[1]);

    return {
      average,
      output,
    };
  },
});