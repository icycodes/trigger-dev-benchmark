import { createClient } from "@trigger.dev/sdk";

export const client = createClient({
  id: "onboarding-app",
  apiKey: process.env.TRIGGER_API_KEY,
});