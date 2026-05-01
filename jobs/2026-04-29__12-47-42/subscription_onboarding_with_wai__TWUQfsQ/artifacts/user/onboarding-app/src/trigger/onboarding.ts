import { runs, task, wait } from "@trigger.dev/sdk";

const trialId = "subscription_onboarding_with_wai__TWUQfsQ";

export const onboardingWorkflow = task({
  id: `onboarding-workflow-${trialId}`,
  run: async (payload: { email: string }, ctx) => {
    await runs.metadata.update({
      runId: ctx.run.id,
      metadata: {
        status: "Waiting for verification",
      },
    });

    const token = await wait.createToken({ timeout: "1h" });

    await runs.metadata.update({
      runId: ctx.run.id,
      metadata: {
        status: "Waiting for verification",
        tokenId: token.id,
      },
    });

    await wait.forToken(token);

    await runs.metadata.update({
      runId: ctx.run.id,
      metadata: {
        status: "Active",
      },
    });

    return {
      email: payload.email,
      tokenId: token.id,
    };
  },
});
