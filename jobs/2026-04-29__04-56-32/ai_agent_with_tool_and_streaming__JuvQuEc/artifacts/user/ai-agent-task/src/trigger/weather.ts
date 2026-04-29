import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__JuvQuEc";

export const weatherTask = schemaTask({
  id: `weatherTask-${TRIAL_ID}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    // Return a dummy weather response
    return { weather: `Sunny and 25°C in ${city}` };
  },
});
