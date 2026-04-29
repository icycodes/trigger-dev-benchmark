import { schemaTask } from "@trigger.dev/sdk";
import { readFileSync } from "fs";
import { z } from "zod";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

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
