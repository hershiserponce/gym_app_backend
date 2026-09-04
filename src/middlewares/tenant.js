const { getTenant } = require('../utils/tenant')

module.exports = (config, { strapi }) => async (ctx, next) => {
  if (ctx.state.user && ctx.path.startsWith('/api/') && !ctx.path.startsWith('/api/auth/')) {
    await getTenant(ctx)
  }
  return next()
}
