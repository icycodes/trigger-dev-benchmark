import { task } from "@trigger.dev/sdk/v3";
import { python } from "@trigger.dev/python";

export const pythonProcessTask = task({
  id: "python-process-python_extension_data_processing__jwM8dXa",
  run: async (payload: number[]) => {
    const result = await python.runScript("./scripts/process.py", payload.map(String));
    
    const output = result.stdout;
    const match = output.match(/Average: ([\d.]+)/);
    
    if (match) {
      return parseFloat(match[1]);
    }
    
    throw new Error(`Failed to parse average from output: ${output}`);
  },
});
