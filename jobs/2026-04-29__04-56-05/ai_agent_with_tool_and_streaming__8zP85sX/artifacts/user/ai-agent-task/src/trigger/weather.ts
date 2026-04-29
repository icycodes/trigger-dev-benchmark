import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

const trial_id = "ai_agent_with_tool_and_streaming__8zP85sX";

export const weatherTask = schemaTask({
  id: `weatherTask-${trial_id}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    return { weather: `Sunny and 25°C in ${payload.city}` };
  },
});
