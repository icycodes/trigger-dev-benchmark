import { configure } from "@trigger.dev/sdk/v3";

const apiKey = process.env.TRIGGER_SECRET_KEY;

if (!apiKey) {
  throw new Error("TRIGGER_SECRET_KEY is not set");
}

configure({
  accessToken: apiKey,
});
