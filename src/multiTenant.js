const { MultiTenant } = require('prisma-multi-tenant')

const multiTenant = new MultiTenant()

module.exports = {
  current: async name => {
    return await multiTenant.get(name)
  }
}
