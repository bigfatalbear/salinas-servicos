import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

// Mantenha em sincronia com src/data/site.ts (LOCALITIES).
const LOCALITY_SLUGS = [
  'sede',
  'encarnacao',
  'conceicao-de-salinas',
  'cairu',
  'dende',
  'barra-do-paraguacu',
]

const STATIC_ROUTES = [
  'categorias',
  'profissionais',
  'comercios',
  'turismo',
  'sobre',
  'divulgue',
  'favoritos',
  'entrar',
  'redefinir-senha',
]

async function loadEnv() {
  try {
    const raw = await readFile(path.join(root, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const [, key, value] = match
      process.env[key] ??= value.replace(/^["']|["']$/g, '')
    }
  } catch {
    // Sem .env.local: gera apenas as rotas estáticas.
  }
}

async function fetchRows(table, select) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return []
  try {
    const response = await fetch(`${url}/rest/v1/${table}?select=${select}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

async function main() {
  await loadEnv()

  const template = await readFile(path.join(dist, 'index.html'), 'utf8')
  const [categories, professionals] = await Promise.all([
    fetchRows('categories', 'slug,active'),
    fetchRows('professionals', 'id,is_active'),
  ])

  const routes = new Set(STATIC_ROUTES)
  const activeCategories = categories.filter((item) => item.active && item.slug)

  for (const locality of LOCALITY_SLUGS) {
    routes.add(`localidades/${locality}`)
  }

  for (const category of activeCategories) {
    routes.add(`servicos/${category.slug}`)
    for (const locality of LOCALITY_SLUGS) {
      routes.add(`servicos/${category.slug}/${locality}`)
    }
  }

  for (const professional of professionals.filter((item) => item.is_active && item.id)) {
    routes.add(`profissionais/${professional.id}`)
  }

  for (const route of routes) {
    const directory = path.join(dist, ...route.split('/'))
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, 'index.html'), template, 'utf8')
  }

  await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'))
  console.log(`[rotas] ${routes.size} páginas estáticas preparadas (status 200)`)
}

main().catch((error) => {
  console.error('[rotas] falhou:', error.message)
  process.exitCode = 0
})
