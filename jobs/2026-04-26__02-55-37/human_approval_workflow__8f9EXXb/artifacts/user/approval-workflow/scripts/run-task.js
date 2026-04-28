import { tasks } from "@trigger.dev/sdk/v3";
async function main() {
    console.log("Triggering task...");
    try {
        const handle = await tasks.trigger("deploy-approval-human_approval_workflow__8f9EXXb", {
            version: "v1.0.0",
        });
        console.log(`Run ID: ${handle.id}`);
    }
    catch (error) {
        console.error("Error triggering task:", error);
    }
}
main().catch(console.error);
