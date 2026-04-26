import { task, wait, metadata } from "@trigger.dev/sdk/v3";

export const onboardingTask = task({
  id: "onboarding-workflow-subscription_onboarding_with_wai__ZEhAh5D",
  run: async (payload: { email: string }) => {
    // 1. Create a waitpoint token using wait.createToken.
    const token = await wait.createToken({ timeout: "1h" });

    // 2. Set the run metadata to {"status": "Waiting for verification"} and include the tokenId.
    await metadata.set("status", "Waiting for verification").set("tokenId", token.id).flush();

    // 3. Pause execution using wait.forToken and wait for the token to be completed.
    await wait.forToken(token.id);

    // 4. Once completed, set the run metadata to {"status": "Active"}.
    await metadata.set("status", "Active").flush();

    return {
      message: "Onboarding completed successfully",
    };
  },
});
