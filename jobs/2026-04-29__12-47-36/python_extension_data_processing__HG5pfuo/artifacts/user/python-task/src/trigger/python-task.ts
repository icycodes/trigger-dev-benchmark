import { task } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

export const pythonProcessTask = task({
  id: "python-process-python_extension_data_processing__HG5pfuo",
  run: async (payload: number[]) => {
    const result = await python.runScript("./scripts/process.py", payload.map(String));
    
    // Parse output: Average: <value>
    const match = result.output.match(/Average: ([\d.]+)/);
    if (!match) {
      throw new Error(`Failed to parse output: ${result.output}`);
    }
    
    return {
      average: parseFloat(match[1]),
    };
  },
});
