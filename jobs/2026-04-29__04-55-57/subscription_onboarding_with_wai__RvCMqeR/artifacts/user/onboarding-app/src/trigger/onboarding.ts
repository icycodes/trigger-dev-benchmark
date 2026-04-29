import { task, wait, metadata } from "@trigger.dev/sdk/v3";

export const onboardingWorkflow = task({
  id: "onboarding-workflow-subscription_onboarding_with_wai__RvCMqeR",
  run: async (payload: { email: string }) => {
    const token = await wait.createToken({ timeout: "1h" });

    metadata.set("status", "Waiting for verification");
    metadata.set("tokenId", token.id);
    await metadata.flush();

    await wait.forToken(token.id);

    metadata.set("status", "Active");
    await metadata.flush();

    return { success: true };
  },
});
