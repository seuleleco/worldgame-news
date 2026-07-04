import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const file = path.join(process.cwd(), 'backend', 'server', 'content.json')
  try {
    const raw = await fs.readFile(file, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed
  } catch (err) {
    // retorna estrutura vazia quando não existe
    return { settings: {} }
  }
})
