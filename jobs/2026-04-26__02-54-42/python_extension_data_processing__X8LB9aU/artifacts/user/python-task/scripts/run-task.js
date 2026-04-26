const numbers = [10, 20, 30, 40, 50];
const taskId = "python-process-python_extension_data_processing__X8LB9aU";

async function main() {
  const { TriggerClient } = await import("@trigger.dev/sdk");
  const client = new TriggerClient({ id: "python-task-client" });

  const event = await client.sendEvent({
    name: taskId,
    payload: {
      numbers,
    },
  });

  const runId = event.id ?? event.runId ?? event.eventId;
  console.log(`Run ID: ${runId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
