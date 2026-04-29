import { client } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

client.defineJob({
  id: `python-process-python_extension_data_processing__TTRvbTT`,
  name: "Python Data Processing",
  version: "1.0.0",
  trigger: client.manualTrigger(),
  integrations: {
    python,
  },
  run: async (payload, io, ctx) => {
    const numbers = payload as number[];

    // Execute the Python script with the numbers as command-line arguments
    const result = await io.runScript("calculate-average", python.runScript("./scripts/process.py", numbers.map(String)));

    // Parse the output to extract the average value
    const match = result.stdout.match(/Average:\s*(.+)/);
    if (!match) {
      throw new Error("Failed to parse output from Python script");
    }

    const average = parseFloat(match[1]);

    return average;
  },
});