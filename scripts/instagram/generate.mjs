import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'
import QRCode from 'qrcode'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const outputDir = path.join(root, 'content', 'instagram')
const historyFile = path.join(outputDir, 'history.json')
const pendingFile = path.join(outputDir, 'pending.json')

const SITE_URL = 'https://bigfatalbear.github.io/salinas-servicos'
const CITY = 'Salinas da Margarida'
const BRAND = 'Salinas Serviços'

const CATEGORIES = [
  { name: 'Eletricista', slug: 'eletricista', hook: 'Instalação, reparo e manutenção elétrica com quem é daqui.' },
  { name: 'Manicure', slug: 'manicure', hook: 'Unhas bem cuidadas, com atendimento perto de você.' },
  { name: 'Frete', slug: 'frete', hook: 'Mudança, carreto e transporte sem dor de cabeça.' },
  { name: 'Pedreiro', slug: 'pedreiro', hook: 'Obra e reforma com profissional da comunidade.' },
  { name: 'Pintor', slug: 'pintor', hook: 'Pintura residencial e predial com acabamento caprichado.' },
  { name: 'Salão de beleza', slug: 'salao-de-beleza', hook: 'Cabelo, maquiagem e autoestima no mesmo lugar.' },
  { name: 'Mecânico', slug: 'mecanico', hook: 'Carro e moto em boas mãos, sem sair da cidade.' },
  { name: 'Diarista', slug: 'diarista', hook: 'Faxina e organização para sobrar tempo no seu dia.' },
  { name: 'Cozinheira', slug: 'cozinheira', hook: 'Comida caseira, marmitas e encomendas para festas.' },
  { name: 'Fotógrafo', slug: 'fotografo', hook: 'Ensaios, eventos e memórias registradas com cuidado.' },
  { name: 'Passeios', slug: 'passeios', hook: 'A baía vista de outro ângulo, com guias locais.' },
  { name: 'Mercados e mercearias', slug: 'mercados-e-mercearias', hook: 'O dia a dia da cidade sem precisar ir longe.' },
  { name: 'Depósitos de bebidas', slug: 'depositos-de-bebidas', hook: 'Bebida gelada e entrega para a sua festa.' },
  { name: 'Materiais de construção', slug: 'materiais-de-construcao', hook: 'Do cimento ao acabamento para a sua obra.' },
  { name: 'Venda de mariscos e peixes', slug: 'venda-de-mariscos-e-peixes', hook: 'O sabor da baía direto de quem trabalha no mar.' },
  { name: 'Táxi e transporte', slug: 'taxi-e-transporte', hook: 'Translado, viagens e transporte com confiança.' },
  { name: 'Serviços de tecnologia', slug: 'servicos-de-tecnologia', hook: 'CFTV, redes e manutenção de computadores.' },
  { name: 'Locação de espaços para festas', slug: 'locacao-de-espacos-para-festas', hook: 'Espaço, buffet e decoração para comemorar.' },
]

const LOCALITIES = [
  { name: 'Salinas', slug: 'sede', hook: 'Da sede aos bairros, quem faz a cidade acontecer.' },
  { name: 'Encarnação', slug: 'encarnacao', hook: 'No distrito, o trabalho de quem conhece cada canto.' },
  { name: 'Conceição de Salinas', slug: 'conceicao-de-salinas', hook: 'Pesca, mariscagem e serviços da comunidade.' },
  { name: 'Cairu', slug: 'cairu', hook: 'Quem atende no distrito e arredores.' },
  { name: 'Dendê', slug: 'dende', hook: 'Porto da Telha e região com atendimento local.' },
  { name: 'Barra do Paraguaçu', slug: 'barra-do-paraguacu', hook: 'Na foz do Paraguaçu, serviços de gente daqui.' },
]

const TIPS = [
  {
    slug: 'como-escolher-profissional',
    eyebrow: 'DICA DA COMUNIDADE',
    title: 'Como escolher um bom profissional em Salinas',
    body: [
      'Peça referência a quem já contratou, combine o serviço por escrito e confirme o valor antes de começar.',
      'No Salinas Serviços você vê o perfil, a categoria e fala direto no WhatsApp.',
    ],
    caption:
      'Antes de contratar, vale conferir três pontos: referência de quem já contratou, combinado claro do que será feito e valor confirmado antes do serviço começar.\n\nNo Salinas Serviços você encontra perfis da cidade, com contato direto e recomendação da comunidade.',
  },
  {
    slug: 'divulgue-seu-servico',
    eyebrow: 'PARA QUEM TRABALHA',
    title: 'Seu trabalho merece ser encontrado',
    body: [
      'Crie seu perfil gratuito, adicione fotos, descreva o serviço e receba contatos direto no WhatsApp.',
      'Sem comissão, sem intermediário e sem letras miúdas.',
    ],
    caption:
      'Se você trabalha com um serviço na cidade, seu perfil no Salinas Serviços é gratuito: fotos, descrição, categoria e contato direto no WhatsApp.\n\nSem comissão e sem intermediário. Quem procura encontra você.',
  },
  {
    slug: 'fortalece-o-comercio-local',
    eyebrow: 'COMUNIDADE',
    title: 'Contratar daqui fortalece a cidade',
    body: [
      'Cada serviço contratado de quem é de Salinas mantém o dinheiro circulando entre as famílias daqui.',
      'Conheça, recomende e valorize o talento local.',
    ],
    caption:
      'Contratar quem é da cidade mantém o dinheiro circulando entre as famílias daqui.\n\nUse o Salinas Serviços para encontrar profissionais e comércios da sede e dos distritos, com contato direto no WhatsApp.',
  },
]

const HASHTAGS =
  '#SalinasDaMargarida #Bahia #Servicos #ComercioLocal #EmpreendedorLocal #BaiaDeTodosOsSantos #TrabalhoLocal #RecôncavoBaiano #Salinas'

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function wrap(text, maxChars, maxLines = 3) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxChars) {
      current = next
      continue
    }
    if (current) lines.push(current)
    current = word
    if (lines.length === maxLines) break
  }
  if (current && lines.length < maxLines) lines.push(current)
  if (lines.length === maxLines) {
    const consumed = lines.join(' ').split(/\s+/).length
    if (consumed < words.length) lines[maxLines - 1] = `${lines[maxLines - 1]}…`
  }
  return lines
}

function pick(list, seed) {
  return list[Math.abs(seed) % list.length]
}

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return hash
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return fallback
  }
}

function buildPost(dateKey) {
  const seed = hashString(dateKey)
  const dayIndex = Math.floor(Date.parse(`${dateKey}T12:00:00Z`) / 86_400_000)
  const mode = dayIndex % 4

  if (mode === 0) {
    const category = pick(CATEGORIES, seed)
    return {
      type: 'servico',
      slug: category.slug,
      eyebrow: 'SERVIÇO EM DESTAQUE',
      title: `${category.name} em ${CITY}`,
      body: [category.hook, 'Perfis da comunidade, com contato direto pelo WhatsApp e recomendação de quem já contratou.'],
      link: `${SITE_URL}/servicos/${category.slug}`,
      caption: `${category.name} em ${CITY}\n\n${category.hook}\n\nNo Salinas Serviços você encontra profissionais da sede e dos distritos, com perfil completo e contato direto no WhatsApp. Sem intermediários e com recomendação da comunidade.\n\nAcesse: ${SITE_URL}/servicos/${category.slug}\n\n${HASHTAGS}`,
    }
  }

  if (mode === 1) {
    const locality = pick(LOCALITIES, seed)
    return {
      type: 'localidade',
      slug: locality.slug,
      eyebrow: 'GENTE DAQUI',
      title: `${locality.name}: quem faz acontecer`,
      body: [locality.hook, 'Encontre profissionais, comércios e serviços perto de você.'],
      link: `${SITE_URL}/localidades/${locality.slug}`,
      caption: `${locality.name}, ${CITY}\n\n${locality.hook}\n\nNo Salinas Serviços você encontra profissionais e comércios com atendimento na localidade, perfil completo e contato direto no WhatsApp.\n\nAcesse: ${SITE_URL}/localidades/${locality.slug}\n\n${HASHTAGS}`,
    }
  }

  if (mode === 2) {
    const tip = pick(TIPS, seed)
    return {
      type: 'dica',
      slug: tip.slug,
      eyebrow: tip.eyebrow,
      title: tip.title,
      body: tip.body,
      link: SITE_URL,
      caption: `${tip.caption}\n\nAcesse: ${SITE_URL}\n\n${HASHTAGS}`,
    }
  }

  const category = pick(CATEGORIES, seed)
  return {
    type: 'convite',
    slug: category.slug,
    eyebrow: 'PARA QUEM TRABALHA',
    title: 'Seu serviço também pode aparecer aqui',
    body: [
      `Se você trabalha como ${category.name.toLowerCase()} em ${CITY}, crie seu perfil gratuito.`,
      'Fotos, descrição e contato direto no WhatsApp. Sem comissão.',
    ],
    link: `${SITE_URL}/entrar?modo=cadastro`,
    caption: `Se você trabalha como ${category.name.toLowerCase()} em ${CITY}, seu lugar é no Salinas Serviços.\n\nCrie seu perfil gratuito, adicione fotos, descreva o serviço e receba contatos direto no WhatsApp. Sem comissão e sem intermediário.\n\nCadastre-se: ${SITE_URL}/entrar?modo=cadastro\n\n${HASHTAGS}`,
  }
}

function buildSvg(post) {
  const titleFont = post.title.length > 34 ? 62 : post.title.length > 26 ? 70 : 78
  const titleLines = wrap(post.title, Math.floor(880 / (titleFont * 0.56)), 3)
  const titleStart = 400
  const titleLineHeight = titleFont * 1.16
  const titleBottom = titleStart + (titleLines.length - 1) * titleLineHeight

  const bodyLines = post.body.flatMap((text) => wrap(text, 54, 2)).slice(0, 4)
  const bodyStart = titleBottom + 110

  const titleSvg = titleLines
    .map(
      (line, index) =>
        `<text x="80" y="${titleStart + index * titleLineHeight}" fill="#ffffff" font-size="${titleFont}" font-weight="800" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif">${escapeXml(line)}</text>`,
    )
    .join('\n  ')

  const bodySvg = bodyLines
    .map(
      (line, index) =>
        `<text x="80" y="${bodyStart + index * 52}" fill="#cfe3ec" font-size="32" font-weight="400" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif">${escapeXml(line)}</text>`,
    )
    .join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1f33"/>
      <stop offset="0.55" stop-color="#0b2437"/>
      <stop offset="1" stop-color="#0e3447"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f5c542"/>
      <stop offset="1" stop-color="#ffd968"/>
    </linearGradient>
  </defs>

  <rect width="1080" height="1350" fill="url(#bg)"/>
  <circle cx="960" cy="150" r="280" fill="#f5c542" opacity="0.10"/>
  <circle cx="110" cy="1210" r="240" fill="#27c5d9" opacity="0.10"/>
  <path d="M-40 1160c180-70 320 40 520 0 210-42 380-40 640 30v220H-40Z" fill="#087ea4" opacity="0.22"/>
  <path d="M-40 1240c200-60 350 40 560 0 200-38 380-20 600 34v160H-40Z" fill="#27c5d9" opacity="0.12"/>

  <text x="80" y="190" fill="#f5c542" font-size="28" font-weight="800" letter-spacing="5" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif">${escapeXml(BRAND.toUpperCase())}</text>
  <text x="80" y="250" fill="#9ab3c1" font-size="30" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif">${escapeXml(`${CITY} · Bahia`)}</text>

  <text x="80" y="330" fill="#f5c542" font-size="26" font-weight="700" letter-spacing="3" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif">${escapeXml(post.eyebrow)}</text>

  ${titleSvg}

  <rect x="80" y="${titleBottom + 38}" width="140" height="8" rx="4" fill="url(#gold)"/>

  ${bodySvg}

  <rect x="80" y="1136" width="500" height="82" rx="41" fill="url(#gold)"/>
  <text x="112" y="1188" fill="#0b1f33" font-size="28" font-weight="800" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif">Acesse o guia da cidade</text>

  <text x="80" y="1298" fill="#9ab3c1" font-size="26" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif">bigfatalbear.github.io/salinas-servicos</text>

  <rect x="740" y="1010" width="280" height="280" rx="28" fill="#ffffff"/>
</svg>`
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const dateKey = new Date().toISOString().slice(0, 10)
  const post = buildPost(dateKey)
  const fileBase = `${dateKey}-${post.type}-${post.slug}`
  const imageFile = `${fileBase}.jpg`
  const imagePath = path.join(outputDir, imageFile)

  const svg = buildSvg(post)
  const qrBuffer = await QRCode.toBuffer(post.link, {
    width: 240,
    margin: 1,
    color: { dark: '#0b1f33', light: '#ffffff' },
  })

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .composite([{ input: qrBuffer, top: 1030, left: 760 }])
    .toFile(imagePath)

  const caption = `${post.caption.slice(0, 2100)}`

  const record = {
    date: dateKey,
    type: post.type,
    slug: post.slug,
    eyebrow: post.eyebrow,
    title: post.title,
    image: `content/instagram/${imageFile}`,
    imageUrl: `https://raw.githubusercontent.com/bigfatalbear/salinas-servicos/main/content/instagram/${imageFile}`,
    link: post.link,
    caption,
    published: false,
  }

  const history = await readJson(historyFile, { posts: [] })
  history.posts = [
    ...history.posts.filter((item) => item.date !== dateKey),
    { date: dateKey, type: post.type, slug: post.slug, image: record.image },
  ].slice(-60)

  await writeFile(historyFile, `${JSON.stringify(history, null, 2)}\n`, 'utf8')
  await writeFile(pendingFile, `${JSON.stringify(record, null, 2)}\n`, 'utf8')

  console.log(`[instagram] post gerado: ${record.image}`)
  console.log(`[instagram] legenda: ${record.caption.slice(0, 80)}...`)
}

main().catch((error) => {
  console.error('[instagram] falha ao gerar:', error)
  process.exitCode = 1
})
