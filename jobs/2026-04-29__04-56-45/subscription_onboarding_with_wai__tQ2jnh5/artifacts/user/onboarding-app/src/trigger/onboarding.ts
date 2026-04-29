import { client } from "@/trigger";
import { wait } from "@trigger.dev/sdk";
import { runs } from "@trigger.dev/sdk";

// Read trial_id from the environment variable
const TRIAL_ID = process.env.TRIAL_ID || "default";

client.defineJob({
  id: `onboarding-workflow-${TRIAL_ID}`,
  name: "Onboarding Workflow",
  version: "1.0.0",
  trigger: {
    event: "onboarding.started",
  },
  run: async (payload, { ctx }) => {
    // Set initial status
    await runs.metadata.update(ctx.run.id, {
      status: "Waiting for verification",
      email: payload.email,
    });

    // Create a waitpoint token with 1 hour timeout
    const token = await wait.createToken({
      timeout: "1h",
      metadata: {
        email: payload.email,
      },
    });

    // Store the token ID in metadata so the frontend can access it
    await runs.metadata.update(ctx.run.id, {
      tokenId: token.id,
    });

    // Wait for the token to be completed (this pauses execution)
    const result = await wait.forToken(token);

    // Once the token is completed, update the status
    await runs.metadata.update(ctx.run.id, {
      status: "Active",
      verified: true,
    });

    return {
      success: true,
      email: payload.email,
      verificationData: result.data,
    };
  },
});