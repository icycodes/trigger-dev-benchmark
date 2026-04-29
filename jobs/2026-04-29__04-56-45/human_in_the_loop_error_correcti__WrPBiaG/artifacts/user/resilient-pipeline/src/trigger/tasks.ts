import { client, wait } from "@trigger.dev/sdk";
import { writeFile } from "fs/promises";
import { join } from "path";

const TRIAL_ID = "human_in_the_loop_error_correcti__WrPBiaG";

client.defineJob({
  id: `unreliable-task-${TRIAL_ID}`,
  name: "Unreliable Task",
  version: "1.0.0",
  trigger: client.eventTrigger({
    name: "unreliable.task",
    schema: {
      type: "object",
      properties: {
        input: { type: "string" },
        shouldFail: { type: "boolean" },
      },
      required: ["input", "shouldFail"],
    },
  }),
  run: async (payload, { ctx }) => {
    const { input, shouldFail } = payload;

    if (shouldFail) {
      throw new Error(`Simulated failure: ${input}`);
    }

    return { result: `Processed: ${input}` };
  },
});

client.defineJob({
  id: `resilient-pipeline-${TRIAL_ID}`,
  name: "Resilient Pipeline",
  version: "1.0.0",
  trigger: client.eventTrigger({
    name: "resilient.pipeline",
    schema: {
      type: "object",
      properties: {
        input: { type: "string" },
      },
      required: ["input"],
    },
  }),
  run: async (payload, { ctx }) => {
    const { input } = payload;

    // First attempt - will fail
    try {
      await ctx.triggerAndWait({
        id: `unreliable-task-${TRIAL_ID}`,
        payload: {
          input,
          shouldFail: true,
        },
      });
    } catch (error) {
      // Expected failure, proceed to waitpoint
      console.log("Caught expected error:", error);
    }

    // Create waitpoint token
    const token = await wait.createToken({
      schema: {
        type: "object",
        properties: {
          correctedInput: { type: "string" },
        },
        required: ["correctedInput"],
      },
    });

    // Write token ID to file
    await writeFile(
      join("/home/user/resilient-pipeline", "waitpoint_token.txt"),
      token.id
    );

    // Wait for the token to be completed
    const completion = await wait.forToken({
      id: token.id,
    });

    // Second attempt with corrected input
    const result = await ctx.triggerAndWait({
      id: `unreliable-task-${TRIAL_ID}`,
      payload: {
        input: completion.output.correctedInput,
        shouldFail: false,
      },
    });

    return result;
  },
});