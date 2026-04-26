import { wait } from "@trigger.dev/sdk/v3";
async function x() {
  const t = await wait.forToken<{ correctedInput: string }>("abc");
  if (t.ok) {
     console.log(t.payload);
  }
}
