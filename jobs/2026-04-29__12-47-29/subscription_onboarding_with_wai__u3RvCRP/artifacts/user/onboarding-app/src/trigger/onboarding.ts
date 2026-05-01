import { task, wait, metadata } from "@trigger.dev/sdk/v3";

export const onboardingTask = task({
  id: "onboarding-workflow-subscription_onboarding_with_wai__u3RvCRP",
  run: async (payload: { email: string }) => {
    // 2. Create a waitpoint token
    const token = await wait.createToken({ timeout: "1h" });

    // 1. Set the run metadata to {"status": "Waiting for verification"}
    // We also include the tokenId so the UI can simulate the verification
    metadata.set("status", "Waiting for verification");
    metadata.set("tokenId", token.id);

    // 3. Pause execution using wait.forToken and wait for the token to be completed
    const result = await wait.forToken(token.id);

    // 4. Once completed, set the run metadata to {"status": "Active"}
    metadata.replace({ status: "Active" });

    return {
      success: true,
      email: payload.email,
      verificationData: result,
    };
  },
});
