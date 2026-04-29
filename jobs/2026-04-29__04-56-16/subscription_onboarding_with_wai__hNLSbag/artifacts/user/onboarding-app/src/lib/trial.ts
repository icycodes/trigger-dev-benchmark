import fs from "node:fs";

let cachedTrialId: string | null = null;

export const readTrialId = (): string => {
  if (cachedTrialId) {
    return cachedTrialId;
  }

  const fileContents = fs.readFileSync("/logs/trial_id", "utf8");
  cachedTrialId = fileContents.trim();
  return cachedTrialId;
};
