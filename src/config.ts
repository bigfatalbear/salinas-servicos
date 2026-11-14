export const APP_NAME = 'Salinas Serviços'
export const APP_TAGLINE = 'Profissionais da nossa cidade'
export const CITY = 'Salinas da Margarida — BA'
export const WHATSAPP_MESSAGE =
  'Olá! Encontrei seu perfil no Salinas Serviços e gostaria de um orçamento.'

export const FAVORITES_KEY = 'ss:favorites'
export const VOTER_KEY = 'ss:voter-token'
export const RECOMMENDED_KEY = 'ss:recommended'
export const POLL_VOTED_KEY = 'ss:poll-voted'

export const POLL_OPTIONS = [
  { key: 'yes', label: 'Sim, quero avaliações' },
  { key: 'no', label: 'Não preciso' },
  { key: 'maybe', label: 'Talvez' },
] as const

export type PollOption = (typeof POLL_OPTIONS)[number]['key']
