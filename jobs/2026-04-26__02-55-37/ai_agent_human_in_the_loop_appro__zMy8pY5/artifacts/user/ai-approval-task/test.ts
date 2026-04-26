import { wait } from "@trigger.dev/sdk/v3";
async function test() {
  const result = await wait.forToken<{ status: string }>("token_id");
  if (!result.ok) {
    let a: any = result;
  }
}
