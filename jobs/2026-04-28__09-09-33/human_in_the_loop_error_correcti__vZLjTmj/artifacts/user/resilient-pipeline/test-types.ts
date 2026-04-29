import { wait } from '@trigger.dev/sdk/v3';
async function test() {
  const token = await wait.createToken();
  const res = await wait.forToken<{ correctedInput: string }>(token.id);
  if (res.ok) {
    res.output.correctedInput;
  }
}
