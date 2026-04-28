import { task, wait, runs } from "@trigger.dev/sdk";

const TRIAL_ID = "subscription_onboarding_with_wai__8SyaU3w";

export const onboardingWorkflow = task({
  id: `onboarding-workflow-${TRIAL_ID}`,
  maxDuration: 3600,
  run: async (payload: { email: string }) => {
    // Step 1: Set status to "Waiting for verification"
    await runs.metadata.update({ status: "Waiting for verification" });

    // Step 2: Create a waitpoint token (valid for 1 hour)
    const token = await wait.createToken({ timeout: "1h" });

    // Step 3: Pause execution until the token is completed
    const result = await wait.forToken(token);

    // Step 4: Set status to "Active" once verified
    await runs.metadata.update({ status: "Active" });

    return {
      email: payload.email,
      verified: true,
      verificationData: result,
    };
  },
});
