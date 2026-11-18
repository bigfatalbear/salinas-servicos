import {
  Anchor,
  BedDouble,
  Camera,
  Fish,
  HeartHandshake,
  Landmark,
  MapPin,
  MessageCircle,
  Music,
  Sailboat,
  Scissors,
  Search,
  Shell,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Sun,
  Sunset,
  ThumbsUp,
  Trees,
  UserPlus,
  Utensils,
  Waves,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export interface NavLinkItem {
  to: string
  label: string
  end?: boolean
}

export const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Início', end: true },
  { to: '/categorias', label: 'Categorias' },
  { to: '/profissionais', label: 'Profissionais' },
  { to: '/comercios', label: 'Comércios' },
  { to: '/turismo', label: 'Turismo' },
  { to: '/sobre', label: 'Sobre' },
]

export interface Locality {
  name: string
  value: string
  match: string[]
  description: string
  icon: LucideIcon
}

export const LOCALITIES: Locality[] = [
  {
    name: 'Salinas',
    value: 'Sede',
    match: ['Sede', 'Centro', 'Salinas'],
    description: 'Sede do município e seus bairros',
    icon: Sun,
  },
  {
    name: 'Encarnação',
    value: 'Encarnação',
    match: ['Encarnação'],
    description: 'Distrito de Encarnação',
    icon: Anchor,
  },
  {
    name: 'Conceição de Salinas',
    value: 'Conceição de Salinas',
    match: ['Conceição de Salinas'],
    description: 'Comunidade pesqueira e marisqueira',
    icon: Fish,
  },
  {
    name: 'Cairu',
    value: 'Cairu',
    match: ['Cairu'],
    description: 'Distrito de Cairu',
    icon: Sailboat,
  },
  {
    name: 'Dendê',
    value: 'Dendê',
    match: ['Dendê'],
    description: 'Distrito de Dendê (Porto da Telha)',
    icon: Trees,
  },
  {
    name: 'Barra do Paraguaçu',
    value: 'Barra do Paraguaçu',
    match: ['Barra do Paraguaçu'],
    description: 'Povoado na foz do Paraguaçu',
    icon: Waves,
  },
]

export const TRUST_POINTS: Array<{ icon: LucideIcon; label: string; text: string }> = [
  {
    icon: MapPin,
    label: 'Gente daqui',
    text: 'Perfis da sede e dos distritos de Salinas.',
  },
  {
    icon: MessageCircle,
    label: 'Contato direto',
    text: 'Você fala com o profissional pelo WhatsApp.',
  },
  {
    icon: ThumbsUp,
    label: 'Comunidade',
    text: 'Recomendações positivas de quem já conhece.',
  },
]

export const HOW_IT_WORKS: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Search,
    title: 'Encontre',
    text: 'Busque por serviço, sinônimo, categoria ou localidade.',
  },
  {
    icon: MessageCircle,
    title: 'Converse',
    text: 'Abra o WhatsApp e combine direto com quem atende.',
  },
  {
    icon: HeartHandshake,
    title: 'Valorize',
    text: 'Recomende o bom trabalho e fortaleça a rede local.',
  },
]

export const TOURISM_HIGHLIGHTS: Array<{
  icon: LucideIcon
  title: string
  text: string
}> = [
  {
    icon: Waves,
    title: 'Baía de Todos-os-Santos',
    text: 'Águas que fazem parte da paisagem e da vida de quem mora em Salinas.',
  },
  {
    icon: Trees,
    title: 'Manguezais',
    text: 'Ecossistema importante para a pesca, a mariscagem e o equilíbrio da costa.',
  },
  {
    icon: Sailboat,
    title: 'Passeios e travessias',
    text: 'A baía e os rios abrem caminhos para conhecer a região por outro ângulo.',
  },
  {
    icon: Utensils,
    title: 'Gastronomia de mar',
    text: 'Peixes e frutos do mar fazem parte da cultura e da mesa local.',
  },
  {
    icon: Music,
    title: 'Cultura e comunidade',
    text: 'Festas, saberes e tradições construídas por gerações de salinenses.',
  },
  {
    icon: Sunset,
    title: 'Pôr do sol na baía',
    text: 'Um convite simples para desacelerar e olhar a cidade com outros olhos.',
  },
]

export const BUSINESS_CATEGORIES: Array<{
  icon: LucideIcon
  title: string
  text: string
}> = [
  { icon: Store, title: 'Mercados', text: 'Compra do dia, conveniência e produtos locais.' },
  { icon: Utensils, title: 'Restaurantes', text: 'Comida caseira, frutos do mar e sabores da terra.' },
  { icon: ShoppingBag, title: 'Lojas', text: 'Roupas, presentes, utilidades e muito mais.' },
  { icon: Wrench, title: 'Oficinas', text: 'Serviços automotivos e manutenção.' },
  { icon: Scissors, title: 'Salões', text: 'Beleza, cuidado e bem-estar.' },
  { icon: BedDouble, title: 'Pousadas', text: 'Hospedagem para quem visita a região.' },
]

export const TOURISM_CARDS: Array<{
  icon: LucideIcon
  title: string
  text: string
}> = [
  ...TOURISM_HIGHLIGHTS,
  {
    icon: Shell,
    title: 'Mariscagem',
    text: 'Um saber tradicional que atravessa gerações e faz parte da identidade local.',
  },
  {
    icon: Landmark,
    title: 'Memória salineira',
    text: 'As salinas ajudaram a formar os primeiros povoados de Salinas da Margarida.',
  },
  {
    icon: Camera,
    title: 'Paisagens para registrar',
    text: 'Luz, água, mangue e comunidade em cenários que mudam com a maré.',
  },
]

export const COMMUNITY_VALUES: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: ShieldCheck,
    title: 'Sem intermediários',
    text: 'O contato acontece direto entre você e o profissional.',
  },
  {
    icon: Sparkles,
    title: 'Feito para a cidade',
    text: 'Uma interface simples, leve e pensada para a realidade local.',
  },
  {
    icon: UserPlus,
    title: 'Aberto a todos',
    text: 'Profissionais da sede e dos distritos podem participar.',
  },
]
