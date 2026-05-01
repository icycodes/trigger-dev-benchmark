import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__y28vu4z";

export const weatherTask = schemaTask({
  id: `weatherTask-${TRIAL_ID}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async () => {
    return { weather: "Sunny and 25°C" };
  },
});
