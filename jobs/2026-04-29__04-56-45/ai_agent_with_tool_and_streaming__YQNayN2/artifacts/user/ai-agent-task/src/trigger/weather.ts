import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

const trialId = "ai_agent_with_tool_and_streaming__YQNayN2";

export const weatherTask = schemaTask({
  id: `weatherTask-${trialId}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    // Return dummy weather data
    return {
      weather: `Sunny and 25°C in ${city}`,
    };
  },
});