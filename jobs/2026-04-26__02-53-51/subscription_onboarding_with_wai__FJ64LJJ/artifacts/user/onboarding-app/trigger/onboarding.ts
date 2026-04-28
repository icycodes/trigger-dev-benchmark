import { client, runs, wait } from "@trigger.dev/sdk";
import { z } from "zod";

const TRIAL_ID = "subscription_onboarding_with_wai__FJ64LJJ";

client.defineJob({
  id: `onboarding-workflow-${TRIAL_ID}`,
  name: "Onboarding Workflow",
  version: "1.0.0",
  trigger: {
    event: "user.signup",
    schema: z.object({
      email: z.string().email(),
    }),
  },
  run: async (payload, io, ctx) => {
    // Step 1: Set initial metadata
    await io.runStatus("set-waiting-status", async () => {
      await runs.metadata.update(ctx.run.id, {
        status: "Waiting for verification",
        email: payload.email,
      });
    });

    // Step 2: Create a waitpoint token
    const token = await io.waitpoint.createToken("create-verification-token", {
      timeout: "1h",
    });

    // Step 3: Pause execution and wait for token completion
    const result = await io.waitpoint.forToken("wait-for-verification", token);

    // Step 4: Once completed, set status to Active
    await io.runStatus("set-active-status", async () => {
      await runs.metadata.update(ctx.run.id, {
        status: "Active",
        email: payload.email,
        verifiedAt: new Date().toISOString(),
      });
    });

    return {
      success: true,
      email: payload.email,
      verified: true,
    };
  },
});