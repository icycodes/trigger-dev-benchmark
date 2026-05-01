import { task } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

const trialId = "python_extension_data_processing__eFuBZWR";

export const pythonProcessTask = task({
  id: `python-process-${trialId}`,
  run: async (payload: number[]) => {
    const { stdout } = await python.runScript(
      "./scripts/process.py",
      payload.map((value) => value.toString())
    );

    const match = stdout.trim().match(/Average:\s*(.+)$/);
    if (!match) {
      throw new Error(`Unexpected output from Python script: ${stdout}`);
    }

    return Number.parseFloat(match[1]);
  },
});
