import { LOCALITIES } from '../data/site'
import type { Professional } from './types'

const STOPWORDS = new Set([
  'a',
  'as',
  'o',
  'os',
  'de',
  'da',
  'do',
  'das',
  'dos',
  'e',
  'em',
  'na',
  'no',
  'nas',
  'nos',
  'ao',
  'aos',
  'para',
  'por',
  'com',
  'sem',
  'um',
  'uma',
])

const CATEGORY_TERMS: Record<string, string[]> = {
  eletricista: [
    'eletrica',
    'energia',
    'tomada',
    'tomadas',
    'chuveiro',
    'quadro de energia',
    'disjuntor',
    'fiacao',
    'instalacao eletrica',
    'reparo eletrico',
    'lampada',
    'iluminacao',
  ],
  manicure: [
    'unha',
    'unhas',
    'esmalte',
    'esmaltacao',
    'gel',
    'alongamento',
    'pedicure',
    'spa dos pes',
    'unha artistica',
    'cuticula',
  ],
  frete: [
    'mudanca',
    'mudancas',
    'transporte',
    'caminhao',
    'carreto',
    'entrega',
    'entregas',
    'freteiro',
    'mudanca residencial',
    'transportadora',
  ],
  pedreiro: [
    'obra',
    'obras',
    'reforma',
    'reformas',
    'alvenaria',
    'reboco',
    'telhado',
    'construcao',
    'cimento',
    'tijolo',
    'muro',
    'piso',
    'contrapiso',
  ],
  pintor: [
    'pintura',
    'parede',
    'paredes',
    'tinta',
    'textura',
    'massa corrida',
    'grafiato',
    'pintura predial',
    'pintura residencial',
  ],
  'salao-de-beleza': [
    'salao',
    'cabelo',
    'cabelos',
    'corte',
    'escova',
    'coloracao',
    'penteado',
    'beleza',
    'maquiagem',
    'barbearia',
    'sobrancelha',
    'depilacao',
    'cabeleireiro',
  ],
  mecanico: [
    'mecanica',
    'carro',
    'moto',
    'oficina',
    'motor',
    'freio',
    'oleo',
    'revisao',
    'suspensao',
    'alinhamento',
    'pneu',
    'bateria',
    'eletrica automotiva',
  ],
  diarista: [
    'limpeza',
    'faxina',
    'domestica',
    'casa',
    'roupa',
    'passar roupa',
    'organizacao',
    'limpeza residencial',
    'limpeza de casa',
  ],
  cozinheira: [
    'comida',
    'almoco',
    'jantar',
    'buffet',
    'marmita',
    'marmitas',
    'festa',
    'doces',
    'salgados',
    'bolo',
    'bolos',
    'quentinha',
    'cozinha',
  ],
  fotografo: [
    'foto',
    'fotos',
    'fotografia',
    'ensaio',
    'casamento',
    'evento',
    'filmagem',
    'videomaker',
    'retrato',
    'book',
    'aniversario',
  ],
  passeios: [
    'passeio',
    'barco',
    'lancha',
    'travessia',
    'ilha',
    'baia',
    'turismo',
    'passeio de barco',
    'mare',
    'praia',
    'trilha',
  ],
  'mercados-e-mercearias': [
    'mercado',
    'mercados',
    'mercearia',
    'supermercado',
    'hortifruti',
    'acougue',
    'padaria',
    'conveniencia',
    'alimento',
    'alimentos',
  ],
  'depositos-de-bebidas': [
    'bebida',
    'bebidas',
    'cerveja',
    'cervejas',
    'refrigerante',
    'refrigerantes',
    'agua',
    'agua mineral',
    'gelo',
    'distribuidora',
    'adega',
    'deposito',
    'bebida gelada',
  ],
  'materiais-de-construcao': [
    'material',
    'materiais',
    'construcao',
    'cimento',
    'areia',
    'tijolo',
    'telha',
    'ferro',
    'madeira',
    'bloco',
    'argamassa',
    'loja de material',
  ],
  'venda-de-mariscos-e-peixes': [
    'peixe',
    'peixes',
    'marisco',
    'mariscos',
    'camarao',
    'siri',
    'ostra',
    'ostras',
    'frutos do mar',
    'pescado',
    'pescaria',
    'marisqueira',
    'peixaria',
  ],
  'taxi-e-transporte': [
    'taxi',
    'mototaxi',
    'carro',
    'transporte',
    'viagem',
    'motorista',
    'van',
    'lotacao',
    'translado',
    'aeroporto',
  ],
  'servicos-de-tecnologia': [
    'tecnologia',
    'cftv',
    'camera',
    'cameras',
    'seguranca',
    'seguranca eletronica',
    'computador',
    'computadores',
    'pc',
    'notebook',
    'celular',
    'smartphone',
    'impressora',
    'impressoras',
    'manutencao',
    'rede',
    'redes',
    'wifi',
    'wi-fi',
    'suporte tecnico',
    'informatica',
    'formatacao',
    'instalacao de cameras',
  ],
  'locacao-de-espacos-para-festas': [
    'festa',
    'festas',
    'salao',
    'espaco',
    'aluguel',
    'locacao',
    'aniversario',
    'casamento',
    'evento',
    'eventos',
    'buffet',
    'decoracao',
    'cha',
    'formatura',
    'confraternizacao',
  ],
  'outros-servicos': ['outros', 'servicos', 'diversos', 'geral'],
}

const LOCALITY_EXTRA_TERMS: Record<string, string[]> = {
  Sede: ['cidade', 'salinas', 'centro'],
  Encarnação: ['ilha', 'encarnacao'],
  'Conceição de Salinas': ['ilha', 'conceicao', 'marisqueira', 'pesqueira'],
  Cairu: ['distrito'],
  Dendê: ['dende', 'porto da telha'],
  'Barra do Paraguaçu': ['barra', 'paraguacu', 'foz'],
}

export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function tokenize(value: string) {
  return normalizeSearchText(value)
    .split(' ')
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
}

function categoryText(professional: Professional) {
  const category = professional.category
  if (!category) return ''
  return [category.name, category.slug, ...(CATEGORY_TERMS[category.slug] ?? [])].join(' ')
}

function localityText(neighborhood: string | null) {
  if (!neighborhood) return ''
  const normalized = normalizeSearchText(neighborhood)
  const terms = LOCALITIES.filter((locality) =>
    locality.match.some((value) => normalized.includes(normalizeSearchText(value))),
  ).flatMap((locality) => [
    locality.name,
    locality.value,
    ...locality.match,
    ...(LOCALITY_EXTRA_TERMS[locality.value] ?? []),
  ])
  return [neighborhood, ...terms].join(' ')
}

function fieldScore(text: string, tokens: string[]) {
  if (!text) return 0
  const normalized = normalizeSearchText(text)
  const fieldTokens = normalized.split(' ')

  return tokens.reduce((score, token) => {
    if (fieldTokens.includes(token)) return score + 10
    if (fieldTokens.some((value) => value.startsWith(token))) return score + 7
    if (token.length >= 4 && fieldTokens.some((value) => value.length >= 4 && token.startsWith(value))) {
      return score + 5
    }
    if (token.length >= 3 && normalized.includes(token)) return score + 3
    return score
  }, 0)
}

export function professionalSearchScore(professional: Professional, query: string) {
  const normalizedQuery = normalizeSearchText(query)
  const tokens = tokenize(query)
  if (!normalizedQuery || !tokens.length) return 0

  const fields = [
    { text: professional.business_name, weight: 4 },
    { text: categoryText(professional), weight: 3 },
    { text: localityText(professional.neighborhood), weight: 3 },
    { text: [professional.description, professional.address].filter(Boolean).join(' '), weight: 1 },
  ]

  let score = 0
  for (const token of tokens) {
    let best = 0
    for (const field of fields) {
      best = Math.max(best, fieldScore(field.text, [token]) * field.weight)
    }
    if (!best) return 0
    score += best
  }

  for (const field of fields) {
    if (fieldScore(field.text, tokens) > 0 && normalizeSearchText(field.text).includes(normalizedQuery)) {
      score += 20 * field.weight
    }
  }

  return score
}
