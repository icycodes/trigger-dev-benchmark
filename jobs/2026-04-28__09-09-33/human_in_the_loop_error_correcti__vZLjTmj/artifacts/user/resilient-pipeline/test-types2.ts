import { task } from '@trigger.dev/sdk/v3';

export const unreliableTask = task({
  id: "unreliable",
  run: async () => {
    return { result: "ok" };
  },
});

async function test() {
  const result = await unreliableTask.triggerAndWait();
  result.unwrap();
  result.output;
}
