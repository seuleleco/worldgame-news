import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const auth = getRequestHeader(event, 'authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '')
  const secret = process.env.CMS_AUTH_TOKEN || useRuntimeConfig().cmsAuthToken

  if (!secret) {
    throw createError({ statusCode: 500, message: 'CMS webhook secret not configured on receiver' })
  }

  if (!token || token !== secret) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)

  // Escrita simples em arquivo. Pode ser trocada por DB/cache conforme necessário.
  const file = path.join(process.cwd(), 'backend', 'server', 'content.json')
  await fs.writeFile(file, JSON.stringify(body, null, 2), 'utf8')

  return { ok: true }
})
