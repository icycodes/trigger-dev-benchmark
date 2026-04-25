import { schedules } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const scheduledSync = schedules.task({
  id: `scheduled-sync-${trialId}`,
  cron: "* * * * *",
  run: async (payload, { ctx }) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    console.log(`Processed ${data.length} items`);
    return { count: data.length };
  },
});
