const crypto = require('crypto')
const { ApplicationError, ValidationError } = require('@strapi/utils').errors

module.exports = (plugin) => {
  const originalRegister = plugin.controllers.auth.register

  plugin.controllers.auth.register = async (ctx) => {
    const body = ctx.request.body || {}
    const { username, email, password, gymName } = body
    if (!username || !email || !password || !gymName) {
      throw new ValidationError('username, email, password and gymName are required')
    }
    if (Object.keys(body).some((key) => !['username', 'email', 'password', 'gymName'].includes(key))) {
      throw new ValidationError('Invalid registration parameters')
    }

    const existing = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { $or: [{ email: email.toLowerCase() }, { username }] },
    })
    if (existing) throw new ApplicationError('Email or Username are already taken')

    const gym = await strapi.db.query('api::gym.gym').create({
      data: { name: gymName, slug: `${gymName}-${crypto.randomUUID()}` },
    })

    try {
      ctx.request.body = { username, email, password, gym: gym.id }
      // The plugin still owns password hashing, role selection, JWT and sanitization.
      const response = await originalRegister(ctx)
      if (ctx.body && ctx.body.user) ctx.body.user.gym = gym
      return response
    } catch (error) {
      await strapi.db.query('api::gym.gym').delete({ where: { id: gym.id } })
      throw error
    }
  }

  return plugin
}
