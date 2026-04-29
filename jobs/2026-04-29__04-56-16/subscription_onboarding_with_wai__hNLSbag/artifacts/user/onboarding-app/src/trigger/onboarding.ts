import { metadata, task, wait } from "@trigger.dev/sdk/v3";
import { readTrialId } from "@/lib/trial";

const trialId = readTrialId();

export const onboardingWorkflow = task({
  id: `onboarding-workflow-${trialId}`,
  run: async (payload: { email: string }) => {
    metadata.replace({ status: "Waiting for verification" });

    const token = await wait.createToken({ timeout: "1h" });
    metadata.replace({
      status: "Waiting for verification",
      tokenId: token.id,
      email: payload.email,
    });

    const result = await wait.forToken<{ verified: boolean }>(token);
    if (!result.ok) {
      throw result.error;
    }

    metadata.replace({ status: "Active" });

    return { verified: result.output?.verified ?? false };
  },
});
