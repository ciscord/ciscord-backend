
const { run } = require('../helpers')

const main = async () => {
  const params = process.argv.slice(3);
  if (params.length !== 3) {
    console.error('command example is npm run new_service -- -- tenant1 postgresql postgresql://postgres:postgres@localhost:5432/ciscord?schema=tenant1')
    process.exit(1)
  }
  const name = params[0];
  const provider = params[1];
  const url = params[2];
  
  // Create new tenant
  await run(`npx prisma-multi-tenant new --name=${name} --provider=${provider} --url=${url}`)

  // Log success
  console.log(`Successfully deployed a new service (${name})!`)
}

main()
