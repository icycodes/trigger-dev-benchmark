import { task, wait, runs } from "@trigger.dev/sdk/v3";

export const onboardingWorkflow = task({
  id: `onboarding-workflow-subscription_onboarding_with_wai__fxrS7Bw`,
  run: async (payload: { email: string }) => {
    // 1. Set the run metadata to {"status": "Waiting for verification"}
    await runs.metadata.update(runs.current().id, {
      status: "Waiting for verification",
    });

    // 2. Create a waitpoint token using wait.createToken
    const token = await wait.createToken({ timeout: "1h" });

    // 3. Pause execution using wait.forToken and wait for the token to be completed
    await wait.forToken(token);

    // 4. Once completed, set the run metadata to {"status": "Active"}
    await runs.metadata.update(runs.current().id, {
      status: "Active",
    });

    return {
      message: `Onboarding completed for ${payload.email}`,
    };
  },
});
