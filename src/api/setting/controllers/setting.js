const { getTenant } = require('../../../utils/tenant')

module.exports = {
  async find(ctx) {
    const gym = await getTenant(ctx)
    if (!gym) return ctx.unauthorized()
    const setting = await strapi.db.query('api::setting.setting').findOne({
      where: { gym: gym.id },
      populate: { logo: true },
    })
    return ctx.send({ data: setting })
  },

  async update(ctx) {
    const gym = await getTenant(ctx)
    if (!gym) return ctx.unauthorized()
    const data = { ...((ctx.request.body && ctx.request.body.data) || {}), gym: gym.id }
    const current = await strapi.db.query('api::setting.setting').findOne({ where: { gym: gym.id } })
    const setting = current
      ? await strapi.db.query('api::setting.setting').update({ where: { id: current.id }, data })
      : await strapi.db.query('api::setting.setting').create({ data })
    return ctx.send({ data: setting })
  },

  async delete(ctx) {
    const gym = await getTenant(ctx)
    if (!gym) return ctx.unauthorized()
    const current = await strapi.db.query('api::setting.setting').findOne({ where: { gym: gym.id } })
    if (!current) return ctx.notFound()
    await strapi.db.query('api::setting.setting').delete({ where: { id: current.id } })
    return ctx.send({ data: current })
  },
}
