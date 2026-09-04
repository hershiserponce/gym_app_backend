const { createCoreController } = require('@strapi/strapi').factories

const USER_UID = 'plugin::users-permissions.user'

async function getTenant(ctx) {
  if (!ctx.state.user) {
    return null
  }

  const user = await strapi.db.query(USER_UID).findOne({
    where: { id: ctx.state.user.id },
    populate: { gym: true },
  })
  const gym = user && user.gym
  if (!gym) {
    const error = new Error('Authenticated user has no gym')
    error.status = 403
    throw error
  }

  ctx.state.tenantId = gym.id
  ctx.state.user.gym = gym
  return gym
}

function relationValues(value) {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object' && Array.isArray(value.connect)) return value.connect
  if (value == null) return []
  return [value]
}

async function validateRelations(uid, data, gymId) {
  const schema = strapi.getModel(uid)
  for (const [name, attribute] of Object.entries(schema.attributes || {})) {
    if (attribute.type !== 'relation' || name === 'gym' || data[name] == null) continue
    for (const relation of relationValues(data[name])) {
      const value = relation && typeof relation === 'object'
        ? (relation.documentId || relation.id)
        : relation
      if (value == null) continue
      let target
      if (/^\d+$/.test(String(value))) {
        target = await strapi.db.query(attribute.target).findOne({
          where: { id: Number(value), gym: gymId },
        })
      } else {
        const relEntity = await strapi.documents(attribute.target).findOne({ documentId: value })
        if (relEntity) {
          const relGymId = typeof relEntity.gym === 'object' ? relEntity.gym?.id : relEntity.gym
          target = relGymId === gymId ? relEntity : null
        }
      }
      if (!target) {
        const error = new Error(`Relation ${name} does not belong to this gym`)
        error.status = 400
        throw error
      }
    }
  }
}

async function findTenantEntity(uid, id, gymId) {
  if (/^\d+$/.test(String(id))) {
    return strapi.db.query(uid).findOne({ where: { id: Number(id), gym: gymId } })
  }
  const entity = await strapi.documents(uid).findOne({ documentId: id })
  if (!entity) return null
  const entityGymId = typeof entity.gym === 'object' ? entity.gym?.id : entity.gym
  return entityGymId === gymId ? entity : null
}

function tenantController(uid) {
  return createCoreController(uid, ({ strapi }) => ({
    async find(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()

      await this.validateQuery(ctx)
      const sanitizedQuery = await this.sanitizeQuery(ctx)

      const params = {
        ...sanitizedQuery,
        filters: {
          ...(sanitizedQuery.filters || {}),
          gym: { id: { $eq: gym.id } },
        },
      }

      const { results, pagination } = await strapi.service(uid).find(params)
      const sanitizedResults = await this.sanitizeOutput(results, ctx)
      return this.transformResponse(sanitizedResults, { pagination })
    },

    async findOne(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()
      if (!(await findTenantEntity(uid, ctx.params.id, gym.id))) return ctx.notFound()
      return super.findOne(ctx)
    },

    async create(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()
      const input = (ctx.request.body && ctx.request.body.data) || {}
      const data = { ...input, gym: gym.id }
      await validateRelations(uid, data, gym.id)

      const entity = await strapi.db.query(uid).create({ data })
      return ctx.send({ data: entity })
    },

    async update(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()
      if (!(await findTenantEntity(uid, ctx.params.id, gym.id))) return ctx.notFound()
      const input = (ctx.request.body && ctx.request.body.data) || {}
      const data = { ...input, gym: gym.id }
      await validateRelations(uid, data, gym.id)
      let entity
      if (/^\d+$/.test(String(ctx.params.id))) {
        entity = await strapi.db.query(uid).update({
          where: { id: ctx.params.id },
          data,
        })
      } else {
        entity = await strapi.documents(uid).update({
          documentId: ctx.params.id,
          data,
        })
      }
      return ctx.send({ data: entity })
    },

    async delete(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()
      if (!(await findTenantEntity(uid, ctx.params.id, gym.id))) return ctx.notFound()
      return super.delete(ctx)
    },
  }))
}

module.exports = { getTenant, tenantController, validateRelations }
