const { getTenant } = require('../utils/tenant')

module.exports = async (ctx) => {
  if (!ctx.state.user) return false
  await getTenant(ctx)
  return true
}
