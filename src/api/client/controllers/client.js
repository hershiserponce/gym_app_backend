const { tenantController } = require('../../../utils/tenant')
const {
  validateFile,
  generatePath,
  getExtensionFromMime,
  uploadFile,
  deleteFile,
  getPublicUrl,
} = require('../../../utils/supabase-storage')

module.exports = tenantController('api::client.client', {}, {
  async uploadPhoto(ctx) {
    const gym = await require('../../../utils/tenant').getTenant(ctx)
    if (!gym) return ctx.unauthorized()

    const { id } = ctx.params
    const file = ctx.request.files?.photo

    if (!file) {
      return ctx.badRequest('No se proporcionó archivo')
    }

    const validation = validateFile(file)
    if (!validation.valid) {
      return ctx.badRequest(validation.error)
    }

    const ext = getExtensionFromMime(file.mimetype)
    const filePath = generatePath(gym.id, 'avatars', id, ext)

    const buffer = require('fs').readFileSync(file.filepath)
    await uploadFile(buffer, filePath, file.mimetype)

    const photoUrl = getPublicUrl(filePath)

    let entity
    if (/^\d+$/.test(String(id))) {
      entity = await strapi.db.query('api::client.client').update({
        where: { id: Number(id) },
        data: { photoUrl },
      })
    } else {
      entity = await strapi.db.query('api::client.client').update({
        where: { documentId: id },
        data: { photoUrl },
      })
    }

    return ctx.send({ data: entity })
  },

  async deletePhoto(ctx) {
    const gym = await require('../../../utils/tenant').getTenant(ctx)
    if (!gym) return ctx.unauthorized()

    const { id } = ctx.params

    let entity
    if (/^\d+$/.test(String(id))) {
      entity = await strapi.db.query('api::client.client').findOne({
        where: { id: Number(id), gym: gym.id },
      })
    } else {
      entity = await strapi.db.query('api::client.client').findOne({
        where: { documentId: id, gym: gym.id },
      })
    }

    if (!entity) return ctx.notFound()

    if (entity.photoUrl) {
      const urlParts = entity.photoUrl.split('/gymapp-storage/')
      if (urlParts.length > 1) {
        await deleteFile(urlParts[1])
      }
    }

    let updated
    if (/^\d+$/.test(String(id))) {
      updated = await strapi.db.query('api::client.client').update({
        where: { id: Number(id) },
        data: { photoUrl: null },
      })
    } else {
      updated = await strapi.db.query('api::client.client').update({
        where: { documentId: id },
        data: { photoUrl: null },
      })
    }

    return ctx.send({ data: updated })
  },
})
