import { task, wait, runs } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "subscription_onboarding_with_wai__VY7XruE";

export const onboardingWorkflow = task({
  id: `onboarding-workflow-${TRIAL_ID}`,
  maxDuration: 3600,
  run: async (payload: { email: string; userId: string }) => {
    // Step 1: Set status to "Waiting for verification"
    await runs.metadata.update({ status: "Waiting for verification" });

    // Step 2: Create a waitpoint token (expires in 1 hour)
    const token = await wait.createToken({ timeout: "1h" });

    // Store the token ID in metadata so the UI can retrieve it
    await runs.metadata.update({
      status: "Waiting for verification",
      tokenId: token.id,
      email: payload.email,
    });

    // Step 3: Pause execution until the token is completed
    await wait.forToken(token);

    // Step 4: Token has been completed — mark as active
    await runs.metadata.update({
      status: "Active",
      email: payload.email,
    });

    return {
      success: true,
      email: payload.email,
      status: "Active",
    };
  },
});
