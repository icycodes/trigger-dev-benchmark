import { task, wait, metadata } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "subscription_onboarding_with_wai__GojEK8k";

export const onboardingWorkflow = task({
  id: `onboarding-workflow-${TRIAL_ID}`,
  maxDuration: 3600,
  run: async (payload: { email: string; trialId: string }) => {
    // Step 1: Set status to "Waiting for verification"
    await metadata.replace({ status: "Waiting for verification", email: payload.email });

    // Step 2: Create a waitpoint token (expires in 1 hour)
    const token = await wait.createToken({ timeout: "1h" });

    // Step 3: Store the token ID in metadata so the UI can use it
    await metadata.replace({
      status: "Waiting for verification",
      tokenId: token.id,
      email: payload.email,
    });

    // Step 4: Pause execution until the token is completed
    await wait.forToken(token);

    // Step 5: Once resumed, set status to "Active"
    await metadata.replace({
      status: "Active",
      email: payload.email,
    });

    return {
      status: "Active",
      email: payload.email,
      message: "Onboarding complete!",
    };
  },
});
