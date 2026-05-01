const { wait } = require("@trigger.dev/sdk/v3");
async function run() {
  const token = await wait.createToken();
  console.log(token);
}
run();
