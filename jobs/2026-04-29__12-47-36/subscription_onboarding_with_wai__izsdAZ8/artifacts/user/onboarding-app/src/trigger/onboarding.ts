import { task, wait, metadata } from "@trigger.dev/sdk/v3";

export const onboardingWorkflow = task({
  id: `onboarding-workflow-subscription_onboarding_with_wai__izsdAZ8`,
  run: async (payload: { email: string }) => {
    // 1. Set the run metadata to {"status": "Waiting for verification"}
    metadata.set("status", "Waiting for verification");

    // 2. Create a waitpoint token using wait.createToken
    const token = await wait.createToken({ timeout: "1h" });

    // Store token in metadata so the UI can find it
    metadata.set("verificationToken", token);

    // 3. Pause execution using wait.forToken and wait for the token to be completed
    await wait.forToken(token);

    // 4. Once completed, set the run metadata to {"status": "Active"}
    metadata.set("status", "Active");

    return { success: true, email: payload.email };
  },
});
