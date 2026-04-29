const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function runTask() {
  try {
    const taskId = 'scheduled-sync-scheduled_sync__XZ6Pex2';
    console.log(`Triggering task: ${taskId}`);
    
    // Run the trigger.dev test command
    const { stdout, stderr } = await execAsync(`npx trigger.dev@latest test ${taskId}`);
    
    // Parse the output to find the Run ID
    const output = stdout + stderr;
    
    // Look for Run ID in the output
    const runIdMatch = output.match(/Run ID: ([a-zA-Z0-9_-]+)/);
    if (runIdMatch) {
      console.log(`Run ID: ${runIdMatch[1]}`);
    } else {
      // If we can't find the exact format, try to extract any ID-like pattern
      const idMatch = output.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
      if (idMatch) {
        console.log(`Run ID: ${idMatch[0]}`);
      } else {
        console.log(output);
      }
    }
  } catch (error) {
    console.error('Error running task:', error.message);
    process.exit(1);
  }
}

runTask();