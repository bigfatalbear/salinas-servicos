import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const pendingFile = path.join(root, 'content', 'instagram', 'pending.json')
const resultsFile = path.join(root, 'content', 'instagram', 'last-publish.json')

const API_VERSION = process.env.IG_API_VERSION || 'v23.0'
const IG_USER_ID = process.env.IG_USER_ID
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function graph(pathname, params) {
  const url = new URL(`https://graph.facebook.com/${API_VERSION}/${pathname}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  const response = await fetch(url, { method: 'POST' })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data?.error?.message || `HTTP ${response.status}`)
    error.code = data?.error?.code
    error.subcode = data?.error?.error_subcode
    throw error
  }
  return data
}

async function graphGet(pathname, params) {
  const url = new URL(`https://graph.facebook.com/${API_VERSION}/${pathname}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  const response = await fetch(url)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.error?.message || `HTTP ${response.status}`)
  }
  return data
}

async function waitForImage(url, attempts = 20, delayMs = 15000) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' })
      if (response.ok) return true
    } catch {
      // Repete até o arquivo ficar acessível.
    }
    console.log(`[instagram] imagem ainda não pública (tentativa ${attempt}/${attempts})`)
    await wait(delayMs)
  }
  return false
}

async function waitForContainer(containerId) {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const data = await graphGet(containerId, {
      fields: 'status_code,status',
      access_token: IG_ACCESS_TOKEN,
    })
    if (data.status_code === 'FINISHED') return
    if (data.status_code === 'ERROR') {
      throw new Error(`Container com erro: ${data.status || 'desconhecido'}`)
    }
    console.log(`[instagram] processando mídia (${data.status_code || 'IN_PROGRESS'})...`)
    await wait(5000)
  }
  throw new Error('Tempo esgotado aguardando o Instagram processar a imagem.')
}

async function createContainer(post, attempts = 6) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await graph(`${IG_USER_ID}/media`, {
        image_url: post.imageUrl,
        caption: post.caption,
        access_token: IG_ACCESS_TOKEN,
      })
    } catch (error) {
      const transient = error.code === 9004 || error.code === 9007 || error.code === 1 || error.code === 2
      if (!transient || attempt === attempts) throw error
      console.log(`[instagram] tentando novamente: ${error.message}`)
      await wait(15000)
    }
  }
  throw new Error('Não foi possível criar o container de mídia.')
}

async function main() {
  if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
    console.log('[instagram] IG_USER_ID ou IG_ACCESS_TOKEN ausente; publicação ignorada.')
    console.log('[instagram] Cadastre os segredos no GitHub para ativar a postagem automática.')
    return
  }

  const post = JSON.parse(await readFile(pendingFile, 'utf8'))
  if (post.published) {
    console.log('[instagram] post pendente já publicado; nada a fazer.')
    return
  }

  console.log(`[instagram] verificando imagem: ${post.imageUrl}`)
  const reachable = await waitForImage(post.imageUrl)
  if (!reachable) {
    throw new Error('A imagem não ficou pública a tempo. Verifique o commit e a URL raw.')
  }

  const container = await createContainer(post)
  await waitForContainer(container.id)

  const published = await graph(`${IG_USER_ID}/media_publish`, {
    creation_id: container.id,
    access_token: IG_ACCESS_TOKEN,
  })

  const result = {
    mediaId: published.id,
    publishedAt: new Date().toISOString(),
    image: post.image,
    type: post.type,
    slug: post.slug,
  }
  await writeFile(resultsFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8')

  post.published = true
  post.mediaId = published.id
  await writeFile(pendingFile, `${JSON.stringify(post, null, 2)}\n`, 'utf8')

  console.log(`[instagram] publicado com sucesso: ${published.id}`)
}

main().catch((error) => {
  console.error('[instagram] falha ao publicar:', error.message)
  process.exitCode = 1
})
