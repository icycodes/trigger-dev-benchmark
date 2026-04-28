import { task } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

export const pythonProcessTask = task({
  id: "python-process-python_extension_data_processing__fGAZgX3",
  run: async (payload: number[]) => {
    const result = await python.runScript("./scripts/process.py", payload.map(String));
    
    const output = result.stdout;
    const match = output.match(/Average:\s*([\d.]+)/);
    if (match) {
      return { average: parseFloat(match[1]) };
    }
    return { average: 0 };
  },
});
