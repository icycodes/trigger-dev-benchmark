import { wait } from "@trigger.dev/sdk/v3";
async function x() {
  const w = await wait.createToken();
  console.log(w.id);
}
