import {
  metadata,
  task,
  wait
} from "../../../../chunk-ETUTL6AO.mjs";
import "../../../../chunk-MZMYRHEF.mjs";
import {
  __name,
  init_esm
} from "../../../../chunk-YNHHDKFZ.mjs";

// trigger/onboarding.ts
init_esm();
var TRIAL_ID = "subscription_onboarding_with_wai__GojEK8k";
var onboardingWorkflow = task({
  id: `onboarding-workflow-${TRIAL_ID}`,
  maxDuration: 3600,
  run: /* @__PURE__ */ __name(async (payload) => {
    await metadata.replace({ status: "Waiting for verification", email: payload.email });
    const token = await wait.createToken({ timeout: "1h" });
    await metadata.replace({
      status: "Waiting for verification",
      tokenId: token.id,
      email: payload.email
    });
    await wait.forToken(token);
    await metadata.replace({
      status: "Active",
      email: payload.email
    });
    return {
      status: "Active",
      email: payload.email,
      message: "Onboarding complete!"
    };
  }, "run")
});
export {
  onboardingWorkflow
};
//# sourceMappingURL=onboarding.mjs.map
