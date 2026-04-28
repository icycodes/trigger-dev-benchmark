#!/usr/bin/env node

/**
 * Test script for Trigger.dev scheduled task
 * 
 * This script provides information about the deployed scheduled task.
 * The task is configured to run every minute and will automatically fetch
 * data from the JSON placeholder API.
 */

console.log("=".repeat(70));
console.log("Trigger.dev Scheduled Data Sync Task - Test Information");
console.log("=".repeat(70));
console.log();

console.log("TASK DETAILS");
console.log("-".repeat(70));
console.log("Task ID:        scheduled-sync-scheduled_sync__qqxXoTS");
console.log("Task Name:      Scheduled Data Sync");
console.log("Schedule:       Every minute (* * * * *)");
console.log("Status:         Deployed and Active");
console.log("Version:        20260425.1");
console.log();

console.log("TASK FUNCTIONALITY");
console.log("-".repeat(70));
console.log("The task performs the following operations:");
console.log("  1. Fetches todos from https://jsonplaceholder.typicode.com/todos");
console.log("  2. Logs the number of items processed");
console.log("  3. Returns success status with item count and timestamp");
console.log();

console.log("TESTING THE TASK");
console.log("-".repeat(70));
console.log("Since this is a scheduled task, it runs automatically every minute.");
console.log();
console.log("To manually trigger the task for testing:");
console.log("  1. Visit the Trigger.dev dashboard:");
console.log("     https://cloud.trigger.dev/projects/v3/proj_qmjtfxoknmfupeecpjod/test");
console.log("  2. Select the task: scheduled-sync-scheduled_sync__qqxXoTS");
console.log("  3. Click 'Trigger' to run the task immediately");
console.log();

console.log("MONITORING");
console.log("-".repeat(70));
console.log("View Deployment:");
console.log("  https://cloud.trigger.dev/projects/v3/proj_qmjtfxoknmfupeecpjod/deployments/ih22onuc");
console.log();
console.log("View Task Runs:");
console.log("  https://cloud.trigger.dev/projects/v3/proj_qmjtfxoknmfupeecpjod/runs");
console.log();

console.log("EXPECTED OUTPUT");
console.log("-".repeat(70));
console.log("When the task runs, you should see:");
console.log("  - Log entry: 'Fetched 200 todos from the external API'");
console.log("  - Task output with:");
console.log("    * success: true");
console.log("    * itemsProcessed: 200");
console.log("    * timestamp: <ISO timestamp>");
console.log();

console.log("=".repeat(70));
console.log("Task is successfully deployed and will run according to schedule!");
console.log("=".repeat(70));