import { wait } from "@trigger.dev/sdk/v3";
type T = Awaited<ReturnType<typeof wait.forToken>>;
