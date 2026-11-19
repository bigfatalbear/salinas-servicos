import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const baseUrl = 'https://bigfatalbear.github.io/salinas-servicos'

// Mantenha em sincronia com src/data/site.ts (LOCALITIES).
const LOCALITY_SLUGS = [
  'sede',
  'encarnacao',
  'conceicao-de-salinas',
  'cairu',
  'dende',
  'barra-do-paraguacu',
]

const STATIC_PATHS = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/categorias', priority: '0.9', changefreq: 'weekly' },
  { path: '/profissionais', priority: '0.9', changefreq: 'daily' },
  { path: '/comercios', priority: '0.7', changefreq: 'weekly' },
  { path: '/turismo', priority: '0.7', changefreq: 'monthly' },
  { path: '/sobre', priority: '0.6', changefreq: 'monthly' },
  { path: '/divulgue', priority: '0.6', changefreq: 'monthly' },
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
    if (!response.ok) {
      console.warn(`[sitemap] ${table}: HTTP ${response.status}`)
      return []
    }
    return await response.json()
  } catch (error) {
    console.warn(`[sitemap] ${table}: ${error.message}`)
    return []
  }
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function entry(loc, { changefreq = 'weekly', priority = '0.6', lastmod } = {}) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

async function main() {
  await loadEnv()

  const [categories, professionals] = await Promise.all([
    fetchRows('categories', 'slug,active'),
    fetchRows('professionals', 'id,updated_at,is_active'),
  ])

  const activeCategories = categories.filter((item) => item.active && item.slug)
  const activeProfessionals = professionals.filter((item) => item.is_active && item.id)

  const today = new Date().toISOString().slice(0, 10)
  const urls = []

  for (const item of STATIC_PATHS) {
    urls.push(
      entry(`${baseUrl}${item.path}`, {
        changefreq: item.changefreq,
        priority: item.priority,
        lastmod: today,
      }),
    )
  }

  for (const category of activeCategories) {
    urls.push(entry(`${baseUrl}/servicos/${category.slug}`, { priority: '0.8' }))
    for (const locality of LOCALITY_SLUGS) {
      urls.push(entry(`${baseUrl}/servicos/${category.slug}/${locality}`, { priority: '0.7' }))
    }
  }

  for (const locality of LOCALITY_SLUGS) {
    urls.push(entry(`${baseUrl}/localidades/${locality}`, { priority: '0.7' }))
  }

  for (const professional of activeProfessionals) {
    urls.push(
      entry(`${baseUrl}/profissionais/${professional.id}`, {
        priority: '0.6',
        lastmod: (professional.updated_at ?? '').slice(0, 10) || undefined,
      }),
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`

  await writeFile(path.join(root, 'public', 'sitemap.xml'), xml, 'utf8')
  console.log(
    `[sitemap] ${urls.length} URLs (${activeCategories.length} categorias, ${activeProfessionals.length} perfis)`,
  )
}

main().catch((error) => {
  console.error('[sitemap] falhou:', error.message)
  process.exitCode = 0
})
