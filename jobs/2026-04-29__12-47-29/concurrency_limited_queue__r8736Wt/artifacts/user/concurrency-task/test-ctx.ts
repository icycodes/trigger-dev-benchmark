import { task } from "@trigger.dev/sdk/v3";
type Keys = keyof Parameters<Parameters<typeof task>[0]["run"]>[1]["ctx"];
const keys: boolean = {} as Keys;
