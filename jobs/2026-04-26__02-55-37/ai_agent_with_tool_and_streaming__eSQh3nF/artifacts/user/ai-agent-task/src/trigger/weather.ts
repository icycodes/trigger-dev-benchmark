import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

export const weatherTask = schemaTask({
  id: "weatherTask-ai_agent_with_tool_and_streaming__eSQh3nF",
  maxDuration: 300,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    return { weather: `Sunny and 25°C in ${payload.city}` };
  },
});
