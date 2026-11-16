export const APP_NAME = 'Salinas Serviços'
export const APP_TAGLINE = 'A cidade se conecta aqui.'
export const APP_DESCRIPTION =
  'Encontre profissionais, serviços e negócios em Salinas da Margarida, na Baía de Todos-os-Santos. Contato direto pelo WhatsApp.'
export const CITY = 'Salinas da Margarida - BA'
export const CITY_NAME = 'Salinas da Margarida'
export const REGION = 'Baía de Todos-os-Santos · Bahia'
export const SITE_URL = 'https://bigfatalbear.github.io/salinas-servicos'
export const OFFICIAL_SOURCE = 'https://www.salinasdamargarida.ba.gov.br/site/dadosmunicipais'
export const WHATSAPP_MESSAGE =
  'Olá! Encontrei seu perfil no Salinas Serviços e gostaria de saber mais.'

export const FAVORITES_KEY = 'ss:favorites'
export const VOTER_KEY = 'ss:voter-token'
export const RECOMMENDED_KEY = 'ss:recommended'
export const POLL_VOTED_KEY = 'ss:poll-voted'
export const THEME_KEY = 'ss:theme'

export const POLL_OPTIONS = [
  { key: 'yes', label: 'Sim, quero avaliações' },
  { key: 'no', label: 'Não preciso' },
  { key: 'maybe', label: 'Talvez' },
] as const

export type PollOption = (typeof POLL_OPTIONS)[number]['key']
