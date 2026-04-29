import { task } from "@trigger.dev/sdk/v3";
import { python } from "@trigger.dev/python";

export const pythonProcessTask = task({
  id: "python-process-python_extension_data_processing__z4UUddb",
  run: async (payload: number[]) => {
    const result = await python.runScript("./scripts/process.py", payload.map(String));
    
    if (!result.stdout) {
      throw new Error("No output from python script");
    }

    // Parse the output: Average: <value>
    const match = result.stdout.match(/Average: ([\d.]+)/);
    if (match && match[1]) {
      return parseFloat(match[1]);
    } else {
      throw new Error(`Failed to parse average from output: ${result.stdout}`);
    }
  },
});
