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
        target = await strapi.db.query(attribute.target).findOne({
          where: { documentId: value, gym: gymId },
        })
      }
      if (!target) {
        const error = new Error(`Relation ${name} does not belong to this gym`)
        error.status = 400
        throw error
      }
    }
  }
}

async function resolveRelationIds(uid, data) {
  const schema = strapi.getModel(uid)
  const resolved = { ...data }
  for (const [name, attribute] of Object.entries(schema.attributes || {})) {
    if (attribute.type !== 'relation' || name === 'gym' || data[name] == null) continue
    const values = relationValues(data[name])
    const resolvedValues = []
    for (const relation of values) {
      const value = relation && typeof relation === 'object'
        ? (relation.documentId || relation.id)
        : relation
      if (value == null) continue
      if (/^\d+$/.test(String(value))) {
        resolvedValues.push(Number(value))
      } else {
        const entity = await strapi.db.query(attribute.target).findOne({
          where: { documentId: value },
        })
        resolvedValues.push(entity ? entity.id : value)
      }
    }
    if (resolvedValues.length === 1) {
      resolved[name] = resolvedValues[0]
    } else if (resolvedValues.length > 1) {
      resolved[name] = resolvedValues
    } else {
      resolved[name] = null
    }
  }
  return resolved
}

async function findTenantEntity(uid, id, gymId) {
  if (/^\d+$/.test(String(id))) {
    return strapi.db.query(uid).findOne({ where: { id: Number(id), gym: gymId } })
  }
  return strapi.db.query(uid).findOne({ where: { documentId: id, gym: gymId } })
}

function tenantController(uid, hooks = {}, customMethods = {}) {
  return createCoreController(uid, ({ strapi }) => ({
    ...customMethods,
    async find(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()

      if (hooks.beforeFind) {
        await hooks.beforeFind({ gym, ctx })
      }

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
      const entity = await findTenantEntity(uid, ctx.params.id, gym.id)
      if (!entity) return ctx.notFound()
      const sanitized = await this.sanitizeOutput(entity, ctx)
      return this.transformResponse(sanitized)
    },

    async create(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()
      const input = (ctx.request.body && ctx.request.body.data) || {}
      const data = { ...input, gym: gym.id }
      await validateRelations(uid, data, gym.id)
      const resolved = await resolveRelationIds(uid, data)

      const entity = await strapi.db.query(uid).create({ data: resolved })
      if (hooks.afterCreate) {
        await hooks.afterCreate(entity, { gym, data: resolved, ctx })
      }
      return ctx.send({ data: entity })
    },

    async update(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()
      if (!(await findTenantEntity(uid, ctx.params.id, gym.id))) return ctx.notFound()
      const input = (ctx.request.body && ctx.request.body.data) || {}
      const data = { ...input, gym: gym.id }
      await validateRelations(uid, data, gym.id)
      const resolved = await resolveRelationIds(uid, data)
      let entity
      if (/^\d+$/.test(String(ctx.params.id))) {
        entity = await strapi.db.query(uid).update({
          where: { id: ctx.params.id },
          data: resolved,
        })
      } else {
        entity = await strapi.db.query(uid).update({
          where: { documentId: ctx.params.id },
          data: resolved,
        })
      }
      return ctx.send({ data: entity })
    },

    async delete(ctx) {
      const gym = await getTenant(ctx)
      if (!gym) return ctx.unauthorized()
      if (!(await findTenantEntity(uid, ctx.params.id, gym.id))) return ctx.notFound()
      if (/^\d+$/.test(String(ctx.params.id))) {
        const entity = await strapi.db.query(uid).delete({
          where: { id: ctx.params.id },
        })
        return ctx.send({ data: entity })
      }
      const entity = await strapi.db.query(uid).delete({
        where: { documentId: ctx.params.id },
      })
      return ctx.send({ data: entity })
    },
  }))
}

module.exports = { getTenant, tenantController, validateRelations }
