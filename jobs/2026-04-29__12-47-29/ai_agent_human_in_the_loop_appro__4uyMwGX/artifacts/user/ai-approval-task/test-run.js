const { runs } = require("@trigger.dev/sdk/v3");
async function run() {
  try {
    const handle = await runs.retrieve("run_cmojn53ly7ejn0hojyxoy0oi8");
    console.log(handle);
  } catch(e) {
    console.error(e);
  }
}
run().then(() => console.log("Done"));
