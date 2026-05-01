import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

const trial_id = "ai_agent_with_tool_and_streaming__6ANSN3z";

export const weatherTask = schemaTask({
  id: `weatherTask-${trial_id}`,
  schema: {
    input: z.object({
      city: z.string(),
    }),
    output: z.object({
      weather: z.string(),
    }),
  },
  run: async ({ input }) => {
    // Return dummy weather data
    return {
      weather: `Sunny and 25°C in ${input.city}`,
    };
  },
});