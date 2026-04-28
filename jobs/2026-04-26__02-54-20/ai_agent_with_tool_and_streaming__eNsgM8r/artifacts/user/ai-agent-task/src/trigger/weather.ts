import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const trialId = "ai_agent_with_tool_and_streaming__eNsgM8r";

export const weatherTask = schemaTask({
  id: `weatherTask-${trialId}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    // Return a dummy weather response
    return {
      weather: `Sunny and 25°C in ${payload.city}`,
    };
  },
});
