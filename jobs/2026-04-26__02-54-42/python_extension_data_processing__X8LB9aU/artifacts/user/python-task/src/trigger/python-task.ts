import { task } from "@trigger.dev/sdk/v3";
import { python } from "@trigger.dev/python";

const trialId = "python_extension_data_processing__X8LB9aU";

type PythonProcessPayload = {
  numbers: number[];
};

export const pythonProcessTask = task({
  id: `python-process-${trialId}`,
  run: async (payload: PythonProcessPayload) => {
    const result = await python.runScript(
      "./scripts/process.py",
      payload.numbers.map(String)
    );

    const output = result.stdout.trim();
    const match = output.match(/Average:\s*([0-9.+-eE]+)/);
    if (!match) {
      throw new Error(`Unexpected output from script: ${output}`);
    }

    return Number(match[1]);
  },
});
