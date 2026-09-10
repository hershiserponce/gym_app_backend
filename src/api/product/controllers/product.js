const { tenantController } = require('../../../utils/tenant')
const {
  validateFile,
  generatePath,
  getExtensionFromMime,
  uploadFile,
  deleteFile,
  getPublicUrl,
} = require('../../../utils/supabase-storage')

module.exports = tenantController('api::product.product', {}, {
  async uploadImage(ctx) {
    const gym = await require('../../../utils/tenant').getTenant(ctx)
    if (!gym) return ctx.unauthorized()

    const { id } = ctx.params
    const file = ctx.request.files?.image

    if (!file) {
      return ctx.badRequest('No se proporcionó archivo')
    }

    const validation = validateFile(file)
    if (!validation.valid) {
      return ctx.badRequest(validation.error)
    }

    const ext = getExtensionFromMime(file.mimetype)
    const filePath = generatePath(gym.id, 'products', id, ext)

    const buffer = require('fs').readFileSync(file.filepath)
    await uploadFile(buffer, filePath, file.mimetype)

    const imageUrl = getPublicUrl(filePath)

    let entity
    if (/^\d+$/.test(String(id))) {
      entity = await strapi.db.query('api::product.product').update({
        where: { id: Number(id) },
        data: { imageUrl },
      })
    } else {
      entity = await strapi.db.query('api::product.product').update({
        where: { documentId: id },
        data: { imageUrl },
      })
    }

    return ctx.send({ data: entity })
  },

  async deleteImage(ctx) {
    const gym = await require('../../../utils/tenant').getTenant(ctx)
    if (!gym) return ctx.unauthorized()

    const { id } = ctx.params

    let entity
    if (/^\d+$/.test(String(id))) {
      entity = await strapi.db.query('api::product.product').findOne({
        where: { id: Number(id), gym: gym.id },
      })
    } else {
      entity = await strapi.db.query('api::product.product').findOne({
        where: { documentId: id, gym: gym.id },
      })
    }

    if (!entity) return ctx.notFound()

    if (entity.imageUrl) {
      const urlParts = entity.imageUrl.split('/gymapp-storage/')
      if (urlParts.length > 1) {
        await deleteFile(urlParts[1])
      }
    }

    let updated
    if (/^\d+$/.test(String(id))) {
      updated = await strapi.db.query('api::product.product').update({
        where: { id: Number(id) },
        data: { imageUrl: null },
      })
    } else {
      updated = await strapi.db.query('api::product.product').update({
        where: { documentId: id },
        data: { imageUrl: null },
      })
    }

    return ctx.send({ data: updated })
  },
})
