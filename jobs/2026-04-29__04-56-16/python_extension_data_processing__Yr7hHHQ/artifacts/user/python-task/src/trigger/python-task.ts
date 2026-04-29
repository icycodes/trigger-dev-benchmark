import { task } from "@trigger.dev/sdk";
import { python } from "@trigger.dev/python";

export const pythonProcessTask = task({
  id: "python-process-python_extension_data_processing__Yr7hHHQ",
  run: async (payload: { numbers: number[] }) => {
    const result = await python.runScript(
      "./scripts/process.py",
      payload.numbers.map((value) => value.toString())
    );

    const output = result.stdout.trim();
    const match = output.match(/Average:\s*([0-9.+-eE]+)/);

    if (!match) {
      throw new Error(`Unexpected output from Python script: ${output}`);
    }

    return Number.parseFloat(match[1]);
  },
});
