const { runs } = require("@trigger.dev/sdk/v3");
async function run() {
  const handle = await runs.retrieve("run_cmojn53ly7ejn0hojyxoy0oi8");
  console.log(handle);
}
run();
