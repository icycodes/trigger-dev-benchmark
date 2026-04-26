import { configure, wait } from "@trigger.dev/sdk";

const tokenId = process.argv[2];

if (!tokenId) {
  throw new Error("Usage: npm run complete:approval -- <tokenId>");
}

if (process.env.TRIGGER_SECRET_KEY) {
  configure({ accessToken: process.env.TRIGGER_SECRET_KEY });
}

await wait.completeToken(tokenId, { approved: true });

console.log(`Completed token ${tokenId}`);
