import { task } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

const trialId = "python_extension_data_processing__QnueCk9";

export const pythonProcessTask = task({
  id: `python-process-${trialId}`,
  maxDuration: 3600,
  run: async (payload: number[]) => {
    const result = await python.runScript("./scripts/process.py", payload.map(String));

    const output = result.stdout.trim();
    const match = output.match(/Average:\s*([\d.]+)/);
    if (!match) {
      throw new Error(`Unexpected output from Python script: ${output}`);
    }

    const average = parseFloat(match[1]);
    return { average };
  },
});
