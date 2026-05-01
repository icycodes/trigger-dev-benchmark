import { client } from "@trigger.dev/sdk";
import { runs, wait } from "@trigger.dev/sdk";

client.define({
  id: `onboarding-workflow-subscription_onboarding_with_wai__LY2tJZ3`,
  name: "User Onboarding Workflow",
  icon: "shield-check",
  run: async (payload, { ctx }) => {
    // Step 1: Set initial status
    await runs.metadata.update({
      status: "Waiting for verification",
      email: payload.email,
      startedAt: new Date().toISOString(),
    });

    // Step 2: Create a waitpoint token
    const token = await wait.createToken({
      timeout: "1h",
      metadata: {
        email: payload.email,
        userId: payload.userId,
      },
    });

    console.log(`Created waitpoint token: ${token.id}`);

    // Step 3: Store the token ID in metadata for retrieval
    await runs.metadata.update({
      status: "Waiting for verification",
      email: payload.email,
      startedAt: new Date().toISOString(),
      tokenId: token.id,
    });

    // Step 4: Wait for the token to be completed
    const result = await wait.forToken(token);

    console.log(`Token completed with result:`, result);

    // Step 5: Update status to active after verification
    await runs.metadata.update({
      status: "Active",
      email: payload.email,
      startedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      tokenId: token.id,
    });

    return {
      success: true,
      email: payload.email,
      userId: payload.userId,
      verifiedAt: new Date().toISOString(),
    };
  },
});