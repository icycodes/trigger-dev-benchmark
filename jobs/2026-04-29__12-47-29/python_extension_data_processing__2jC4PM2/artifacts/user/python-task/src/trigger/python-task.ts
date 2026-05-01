import { task } from "@trigger.dev/sdk/v3";
import { python } from "@trigger.dev/python";

export const pythonProcessTask = task({
  id: "python-process-python_extension_data_processing__2jC4PM2",
  run: async (payload: number[]) => {
    const result = await python.runScript("./scripts/process.py", payload.map(String));
    
    // Parse output
    // The output is an object with stdout property
    const stdout = result.stdout;
    const match = stdout.match(/Average:\s*([-\d\.]+)/);
    
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
    
    return null;
  },
});
