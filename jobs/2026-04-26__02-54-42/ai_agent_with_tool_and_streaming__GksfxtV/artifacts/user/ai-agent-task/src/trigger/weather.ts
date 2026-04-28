import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

const trialId = "ai_agent_with_tool_and_streaming__GksfxtV";

export const weatherTask = schemaTask({
  id: `weatherTask-${trialId}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    return {
      weather: `Sunny and 25°C in ${city}`,
    };
  },
});
