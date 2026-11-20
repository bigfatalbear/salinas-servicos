export const APP_NAME = 'Salinas Serviços'
export const APP_TAGLINE = 'A cidade se conecta aqui.'
export const APP_DESCRIPTION =
  'Encontre profissionais, serviços e negócios em Salinas da Margarida, na Baía de Todos-os-Santos. Contato direto pelo WhatsApp.'
export const CITY = 'Salinas da Margarida - BA'
export const CITY_NAME = 'Salinas da Margarida'
export const REGION = 'Baía de Todos-os-Santos · Bahia'
export const SITE_URL = 'https://bigfatalbear.github.io/salinas-servicos'
export const SHARE_INVITE = `🚀 NOVIDADE EM SALINAS DA MARGARIDA E REGIÃO! 🌴📲

🔎 SALINAS SERVIÇOS chegou para conectar você a serviços, profissionais, empresas e negócios da nossa região.

💼 Você tem um negócio ou presta algum serviço?
📢 Divulgue seu trabalho e seja encontrado por novos clientes!

🛠️ Está procurando um serviço?
🔍 Encontre profissionais e empresas de forma simples e rápida.

📍 Salinas da Margarida e regiões
🤝 Valorize quem trabalha e empreende por aqui!

🌐 ACESSE AGORA:
👉 ${SITE_URL}/

📲 Conheça, cadastre seu negócio e compartilhe com seus amigos!

💙 SALINAS SERVIÇOS
Conectando pessoas, serviços e negócios da nossa região.`
export const OFFICIAL_SOURCE = 'https://www.salinasdamargarida.ba.gov.br/site/dadosmunicipais'
export const WHATSAPP_MESSAGE =
  'Olá! Encontrei seu perfil no Salinas Serviços e gostaria de saber mais.'

export const FAVORITES_KEY = 'ss:favorites'
export const VOTER_KEY = 'ss:voter-token'
export const RECOMMENDED_KEY = 'ss:recommended'
export const POLL_VOTED_KEY = 'ss:poll-voted'
export const THEME_KEY = 'ss:theme'
export const INSTALL_KEY = 'ss:install-dismissed'

export const POLL_OPTIONS = [
  { key: 'yes', label: 'Sim, quero avaliações' },
  { key: 'no', label: 'Não preciso' },
  { key: 'maybe', label: 'Talvez' },
] as const

export type PollOption = (typeof POLL_OPTIONS)[number]['key']
