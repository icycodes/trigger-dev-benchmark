import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__ZbC7ga3";

export const weatherTask = schemaTask({
  id: `weatherTask-${TRIAL_ID}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    // Dummy weather response - you can make it more dynamic if you want
    return {
      weather: "Sunny and 25°C",
    };
  },
});