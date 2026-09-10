const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'gymapp-storage'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

let supabaseInstance = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
    }
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  }
  return supabaseInstance
}

function validateFile(file) {
  if (!file || !file.mimetype) {
    return { valid: false, error: 'No se proporcionó archivo' }
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Use: JPG, PNG o WebP`,
    }
  }

  if (file.size && file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo de 5 MB (${sizeMB} MB)`,
    }
  }

  return { valid: true }
}

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function generatePath(gymId, type, entityId, ext) {
  const safeExt = ext.toLowerCase().replace(/[^a-z]/g, '')
  return `gyms/${gymId}/${type}/${entityId}.${safeExt}`
}

function getExtensionFromMime(mimetype) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  return map[mimetype] || 'jpg'
}

async function uploadFile(buffer, filePath, contentType) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    throw new Error(`Error al subir archivo: ${error.message}`)
  }

  return data.path || filePath
}

async function deleteFile(filePath) {
  const supabase = getSupabaseClient()

  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .remove([filePath])

  if (error) {
    console.error('Error al eliminar archivo:', error.message)
  }
}

function getPublicUrl(path) {
  const supabase = getSupabaseClient()

  const { data } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}

module.exports = {
  validateFile,
  sanitizeFileName,
  generatePath,
  getExtensionFromMime,
  uploadFile,
  deleteFile,
  getPublicUrl,
  ALLOWED_TYPES,
  MAX_FILE_SIZE,
}
