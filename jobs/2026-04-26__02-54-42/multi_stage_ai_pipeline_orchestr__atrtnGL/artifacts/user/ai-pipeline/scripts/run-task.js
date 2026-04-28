const { execSync } = require("child_process");

const trialId = "multi_stage_ai_pipeline_orchestr__atrtnGL";
const payload = {
  topic: "Artificial Intelligence",
  languages: ["Spanish", "French", "German"],
};

const command = `npx trigger.dev@latest run research-pipeline-${trialId} --payload '${JSON.stringify(
  payload
)}'`;

try {
  const output = execSync(command, { encoding: "utf8" });
  const runIdMatch = output.match(/Run ID:\s*(\S+)/i);

  if (runIdMatch) {
    console.log(`Run ID: ${runIdMatch[1]}`);
  } else {
    console.log(output.trim());
  }
} catch (error) {
  if (error.stdout) {
    process.stdout.write(error.stdout);
  }
  if (error.stderr) {
    process.stderr.write(error.stderr);
  }
  throw error;
}
