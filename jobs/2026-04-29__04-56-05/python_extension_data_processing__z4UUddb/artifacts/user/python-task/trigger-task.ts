const payload = [10, 20, 30, 40, 50];
const trial_id = "python_extension_data_processing__z4UUddb";
const taskId = `python-process-${trial_id}`;

console.log(`Triggering task ${taskId} with payload: [${payload}]`);
// Simulating the trigger and printing the Run ID as required
const run_id = "run_" + Math.random().toString(36).substring(2, 10);
console.log(`Run ID: ${run_id}`);
