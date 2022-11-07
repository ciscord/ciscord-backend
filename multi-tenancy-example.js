// const { PrismaClient } = require('@prisma/client') // Uncomment for TypeScript support
const { MultiTenant } = require('prisma-multi-tenant')

// This is the name of your first tenant, try with another one
const name = "dev"

// If you are using TypeScript, you can do "new MultiTenant<PrismaClient>()" for autocompletion
const multiTenant = new MultiTenant()

async function main() {
  // Prisma-multi-tenant will connect to the correct tenant
  const prisma = await multiTenant.get(name)

  // You keep the same interface as before
  const users = await prisma.user.findMany()

  console.log(users)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await multiTenant.disconnect()
  })
