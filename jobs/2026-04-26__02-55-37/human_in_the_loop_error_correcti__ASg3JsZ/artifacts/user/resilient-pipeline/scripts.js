const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  "run-pipeline": "node -e \"const { tasks } = require('@trigger.dev/sdk/v3'); tasks.trigger('resilient-pipeline-human_in_the_loop_error_correcti__ASg3JsZ', { input: 'initial data' }).then(r => console.log('Run ID: ' + r.id))\"",
  "complete-waitpoint": "node -e \"const fs = require('fs'); const { wait } = require('@trigger.dev/sdk/v3'); const token = fs.readFileSync('waitpoint_token.txt', 'utf8').trim(); wait.completeToken(token, { correctedInput: 'fixed data' }).then(() => console.log('Waitpoint completed'))\""
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
