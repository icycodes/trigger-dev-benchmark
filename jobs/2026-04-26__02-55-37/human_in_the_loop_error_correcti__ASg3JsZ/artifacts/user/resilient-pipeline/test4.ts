import { wait } from "@trigger.dev/sdk/v3";
async function x() {
  await wait.completeToken("abc", { correctedInput: "fixed data" });
}
