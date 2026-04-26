import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";
import fs from "fs";

const trial_id = fs.existsSync("/logs/trial_id")
  ? fs.readFileSync("/logs/trial_id", "utf-8").trim()
  : "default";

export const weatherTask = schemaTask({
  id: `weatherTask-${trial_id}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    return { weather: `Sunny and 25°C in ${payload.city}` };
  },
});
