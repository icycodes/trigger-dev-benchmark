const { wait } = require("@trigger.dev/sdk/v3");

async function main() {
  const token = process.argv[2];

  if (!token) {
    console.error("Usage: npm run approve-task <token>");
    process.exit(1);
  }

  await wait.completeToken(token, {
    approved: true,
    approvedAt: new Date().toISOString(),
  });

  console.log(`Approved token: ${token}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
