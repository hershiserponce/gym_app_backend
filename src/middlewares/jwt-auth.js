const USER_UID = 'plugin::users-permissions.user'

module.exports = (config, { strapi }) => async (ctx, next) => {
  const authHeader = ctx.request.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    try {
      const decoded = await strapi
        .plugin('users-permissions')
        .service('jwt')
        .verify(token)

      const user = await strapi.db.query(USER_UID).findOne({
        where: { id: decoded.id },
        populate: { role: true, gym: true },
      })

      if (user) {
        ctx.state.user = user
      }
    } catch (err) {
      // Token inválido o expirado — no setear usuario
    }
  }

  return next()
}
