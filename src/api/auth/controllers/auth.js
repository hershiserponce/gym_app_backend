const crypto = require('crypto')
const { ApplicationError, ValidationError } = require('@strapi/utils').errors

const USER_UID = 'plugin::users-permissions.user'

function serializeUser(user) {
  return {
    id: user.id,
    documentId: user.documentId,
    username: user.username,
    email: user.email,
    provider: user.provider,
    confirmed: user.confirmed,
    blocked: user.blocked,
    role: user.role,
    gym: user.gym,
  }
}

module.exports = {
  async me(ctx) {
    const authHeader = ctx.request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) return ctx.unauthorized()

    const token = authHeader.replace('Bearer ', '')
    let decoded
    try {
      decoded = await strapi.plugin('users-permissions').service('jwt').verify(token)
    } catch {
      return ctx.unauthorized()
    }

    const user = await strapi.db.query(USER_UID).findOne({
      where: { id: decoded.id },
      populate: { role: true, gym: true },
    })

    if (!user) return ctx.unauthorized()
    return ctx.send(serializeUser(user))
  },

  async signup(ctx) {
    const body = ctx.request.body || {}
    const { username, email, password, gymName } = body

    if (!username || !email || !password || !gymName) {
      throw new ValidationError('username, email, password and gymName are required')
    }

    const existing = await strapi.db.query(USER_UID).findOne({
      where: { $or: [{ email: email.toLowerCase() }, { username }] },
    })
    if (existing) throw new ApplicationError('Email or Username are already taken')

    const role = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'authenticated' },
    })
    if (!role) throw new ApplicationError('Authenticated role is not configured')

    const gym = await strapi.db.query('api::gym.gym').create({
      data: { name: gymName, slug: `${gymName}-${crypto.randomUUID()}` },
    })

    try {
      const user = await strapi.plugin('users-permissions').service('user').add({
        username,
        email: email.toLowerCase(),
        password,
        provider: 'local',
        confirmed: true,
        blocked: false,
        role: role.id,
        gym: gym.id,
      })
      const jwt = await strapi.plugin('users-permissions').service('jwt').issue({ id: user.id })
      const safeUser = await strapi.db.query(USER_UID).findOne({
        where: { id: user.id },
        populate: { role: true, gym: true },
      })
      return ctx.send({
        jwt,
        user: serializeUser(safeUser),
      })
    } catch (error) {
      await strapi.db.query('api::gym.gym').delete({ where: { id: gym.id } })
      throw error
    }
  },
}
