import { task, logger } from "@trigger.dev/sdk/v3";
import { runs } from "@trigger.dev/sdk/v3";

const myTask = task({
  id: "test",
  run: async (payload, { ctx }) => {
    console.log("ctx keys:", Object.keys(ctx));
  }
});
