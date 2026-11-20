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
  slug: string
  match: string[]
  description: string
  icon: LucideIcon
}

export const LOCALITIES: Locality[] = [
  {
    name: 'Salinas',
    value: 'Sede',
    slug: 'sede',
    match: ['Sede', 'Centro', 'Salinas'],
    description: 'Sede do município e seus bairros',
    icon: Sun,
  },
  {
    name: 'Encarnação',
    value: 'Encarnação',
    slug: 'encarnacao',
    match: ['Encarnação'],
    description: 'Distrito de Encarnação',
    icon: Anchor,
  },
  {
    name: 'Conceição de Salinas',
    value: 'Conceição de Salinas',
    slug: 'conceicao-de-salinas',
    match: ['Conceição de Salinas'],
    description: 'Comunidade pesqueira e marisqueira',
    icon: Fish,
  },
  {
    name: 'Cairu',
    value: 'Cairu',
    slug: 'cairu',
    match: ['Cairu'],
    description: 'Distrito de Cairu',
    icon: Sailboat,
  },
  {
    name: 'Dendê',
    value: 'Dendê',
    slug: 'dende',
    match: ['Dendê'],
    description: 'Distrito de Dendê (Porto da Telha)',
    icon: Trees,
  },
  {
    name: 'Barra do Paraguaçu',
    value: 'Barra do Paraguaçu',
    slug: 'barra-do-paraguacu',
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

export interface TourismPlace {
  slug: string
  icon: LucideIcon
  title: string
  text: string
  lede: string
  story: string[]
  facts: string[]
  tip: string
  links: Array<{ label: string; to: string }>
}

export const TOURISM_PLACES: TourismPlace[] = [
  {
    slug: 'baia-de-todos-os-santos',
    icon: Waves,
    title: 'Baía de Todos-os-Santos',
    text: 'Águas que fazem parte da paisagem e da vida de quem mora em Salinas.',
    lede: 'A baía não é só cenário: é rua, estrada e despensa. É por ela que passam barcos, pescadores e boa parte da história da cidade.',
    story: [
      'Salinas da Margarida fica na margem oeste da Baía de Todos-os-Santos, de frente para a Ilha de Itaparica. A baía é uma das maiores do país e banha o Recôncavo Baiano, região formada por cidades históricas como Cachoeira, Santo Amaro e Maragogipe.',
      'Aqui, a maré organiza o dia: define a hora da pesca, da mariscagem, da travessia e do banho. As águas mornas e calmas também ajudam a explicar a vocação da cidade para o turismo de natureza e para a navegação.',
    ],
    facts: [
      'A sede fica em frente à Ilha de Itaparica; o limite do município é marítimo.',
      'O Cais da Praia da Ponte, no centro, é ponto de embarque e de contemplação.',
      'A baía integra o Recôncavo Baiano, território de forte herança afro-brasileira.',
    ],
    tip: 'Antes de programar passeio de barco, confirme o horário da maré e as condições do vento com quem navega na região.',
    links: [
      { label: 'Profissionais na sede', to: '/localidades/sede' },
      { label: 'Ver todos os perfis', to: '/profissionais' },
    ],
  },
  {
    slug: 'manguezais',
    icon: Trees,
    title: 'Manguezais',
    text: 'Ecossistema importante para a pesca, a mariscagem e o equilíbrio da costa.',
    lede: 'O manguezal é berçário: cria peixes, siris e mariscos que sustentam a pesca e a mesa da cidade.',
    story: [
      'Grande parte da costa de Salinas é formada por manguezais, planícies de maré e apicuns — áreas salgadas de transição entre o mangue e a terra firme. Esse conjunto protege a costa e serve de abrigo para aves, crustáceos e moluscos.',
      'Para muitas famílias, o mangue é local de trabalho. A coleta de mariscos, a pesca de siri e a cata de ostras dependem do conhecimento das marés e das fases da lua, transmitido de geração em geração.',
    ],
    facts: [
      'As raízes do mangue seguram o sedimento e reduzem a erosão da costa.',
      'Encarnação é um dos pontos onde a relação com o mangue aparece no dia a dia.',
      'Apicuns são áreas salgadas entre o manguezal e a terra firme.',
    ],
    tip: 'Não pise nas raízes nem retire caranguejos e mariscos sem orientação: o manguezal demora anos para se recuperar.',
    links: [
      { label: 'Conhecer Encarnação', to: '/localidades/encarnacao' },
      { label: 'Conceição de Salinas', to: '/localidades/conceicao-de-salinas' },
    ],
  },
  {
    slug: 'passeios-e-travessias',
    icon: Sailboat,
    title: 'Passeios e travessias',
    text: 'A baía e os rios abrem caminhos para conhecer a região por outro ângulo.',
    lede: 'Do cais da sede saem barcos e histórias. A baía e o rio Paraguaçu abrem outros caminhos para conhecer a região.',
    story: [
      'O cais da sede recebe embarcações particulares e passeios pela baía. Em Barra do Paraguaçu, na foz do rio Paraguaçu, o encontro entre rio e mar cria um estuário de manguezais, aves e água calma — bom para banho, caiaque e pesca de linha.',
      'O Paraguaçu é o “rio grande” dos tupinambás e um dos caminhos históricos do Recôncavo. Na outra margem, em Cachoeira, ficam as ruínas do Convento de Santo Antônio do Paraguaçu, do século XVII.',
    ],
    facts: [
      'De Salvador, o caminho mais curto combina ferry-boat até Bom Despacho e a BA-001.',
      'Barra do Paraguaçu fica no extremo norte do município.',
      'Travessias e passeios devem ser combinados com condutores locais.',
    ],
    tip: 'Combine o passeio com antecedência e leve água, protetor solar e dinheiro em espécie; nem todo vilarejo tem sinal ou maquininha.',
    links: [
      { label: 'Barra do Paraguaçu', to: '/localidades/barra-do-paraguacu' },
      { label: 'Profissionais na sede', to: '/localidades/sede' },
    ],
  },
  {
    slug: 'gastronomia-de-mar',
    icon: Utensils,
    title: 'Gastronomia de mar',
    text: 'Peixes e frutos do mar fazem parte da cultura e da mesa local.',
    lede: 'A mariscada é prato típico de Salinas. Mas a mesa local vai além: moqueca, pirão, feijão-fradinho e farofa contam a história do Recôncavo.',
    story: [
      'Peixes, camarões, siris e mariscos chegam à mesa vindos da baía e dos manguezais. Nos quiosques do calçadão e nos restaurantes da orla, a moqueca e a mariscada aparecem acompanhadas de pirão, arroz, feijão-fradinho e farofa.',
      'O artesanato também nasce do mar: conchas, búzios e escamas de peixe viram bonecas, pássaros, colares e peças de decoração, muitas vezes coletados por marisqueiras na maré baixa.',
    ],
    facts: [
      'Mariscada é o prato mais associado à cidade.',
      'A pimenta e o azeite de dendê marcam a cozinha do Recôncavo.',
      'Artesanato de conchas e escamas é uma produção local.',
    ],
    tip: 'Peça o peixe do dia e pergunte de onde ele veio: apoiar quem pesca na baía mantém a cadeia local viva.',
    links: [
      { label: 'Profissionais na sede', to: '/localidades/sede' },
      { label: 'Ver todos os perfis', to: '/profissionais' },
    ],
  },
  {
    slug: 'cultura-e-comunidade',
    icon: Music,
    title: 'Cultura e comunidade',
    text: 'Festas, saberes e tradições construídas por gerações de salinenses.',
    lede: 'Salinas é terra tupinambá, quilombola e pesqueira. A identidade da cidade mistura fé, trabalho no mar e festa.',
    story: [
      'Antes da colonização, a região era habitada por povos tupinambás. Conceição de Salinas é reconhecida como comunidade quilombola, e a Igreja de Nossa Senhora da Encarnação, com origem em 1620, é a edificação mais antiga do município.',
      'Festas religiosas, novenas, samba de roda e saberes ligados à pesca e à mariscagem fazem parte do calendário e da memória do Recôncavo. A emancipação municipal é comemorada em 27 de julho.',
    ],
    facts: [
      'Igreja de N. Sra. da Encarnação: capela de 1620, reedificada em 1705.',
      'Conceição de Salinas tem identidade quilombola.',
      'O município foi emancipado em 27 de julho de 1962.',
    ],
    tip: 'Ao visitar uma festa ou comunidade, pergunte antes de fotografar pessoas e prefira comprar de quem produz no lugar.',
    links: [
      { label: 'Conhecer Encarnação', to: '/localidades/encarnacao' },
      { label: 'Conceição de Salinas', to: '/localidades/conceicao-de-salinas' },
    ],
  },
  {
    slug: 'por-do-sol-na-baia',
    icon: Sunset,
    title: 'Pôr do sol na baía',
    text: 'Um convite simples para desacelerar e olhar a cidade com outros olhos.',
    lede: 'Na margem oeste da baía, o sol se despede atrás da Ilha de Itaparica — e a cidade inteira vira plateia.',
    story: [
      'O calçadão do Cais da Praia da Ponte é o ponto mais conhecido para ver o fim da tarde: quiosques, barcos ancorados e vista aberta para a baía. A luz muda rápido e a maré transforma o cenário a cada hora.',
      'Quem quer fugir do movimento pode procurar as pontas de areia do município, como Ponta do Dourado e Porto da Telha, sempre respeitando o acesso das comunidades e o trabalho dos pescadores.',
    ],
    facts: [
      'O sol se põe do lado da baía, visto da sede.',
      'A maré baixa revela bancos de areia e muda a paisagem.',
      'O calçadão concentra quiosques e restaurantes.',
    ],
    tip: 'Chegue uns 30 minutos antes e fique até o fim do crepúsculo: a luz mais bonita costuma vir depois que o sol some.',
    links: [
      { label: 'Profissionais na sede', to: '/localidades/sede' },
      { label: 'Dendê (Porto da Telha)', to: '/localidades/dende' },
    ],
  },
  {
    slug: 'mariscagem',
    icon: Shell,
    title: 'Mariscagem',
    text: 'Um saber tradicional que atravessa gerações e faz parte da identidade local.',
    lede: 'Mariscar é ofício de mulher, de paciência e de maré. O saber das marisqueiras sustenta famílias e aparece na mesa e no artesanato.',
    story: [
      'Na maré baixa, marisqueiras percorrem mangues e bancos de areia recolhendo moluscos e crustáceos. Em Encarnação, é comum a cata dos “chumbinhos” na areia e a pesca de siri com o gereré, armadilha feita com talas.',
      'O conhecimento de lua, vento e correnteza passa de mãe para filha e de vizinha para vizinha. Hoje, esse saber também se conecta ao turismo, ao artesanato e à venda direta de mariscos.',
    ],
    facts: [
      'A maré baixa é o horário de trabalho no mangue.',
      'O gereré é uma armadilha tradicional para siri.',
      'Conchas e escamas viram artesanato vendido na cidade.',
    ],
    tip: 'Compre marisco de quem cata na região e respeite o defeso e os tamanhos mínimos.',
    links: [
      { label: 'Conhecer Encarnação', to: '/localidades/encarnacao' },
      { label: 'Conceição de Salinas', to: '/localidades/conceicao-de-salinas' },
    ],
  },
  {
    slug: 'memoria-salineira',
    icon: Landmark,
    title: 'Memória salineira',
    text: 'As salinas ajudaram a formar os primeiros povoados de Salinas da Margarida.',
    lede: 'O nome da cidade vem do sal. As primeiras salinas foram inauguradas em 1881 e atraíram os primeiros moradores do povoado.',
    story: [
      'O comendador Manoel de Souza Campos instalou as fazendas Santa Luzia e Conceição e, depois de conhecer as salinas de Aveiro, em Portugal, trouxe o técnico José Soares para explorar o sal em terras de apicum. Em 1881, as primeiras salinas começaram a funcionar na Ponta da Margarida.',
      'A atividade atraiu trabalhadores e fez crescer povoados como Arraial do Dourado e Caperenga. A origem do nome “Margarida” tem duas versões: uma antiga moradora da ponta ou a abundância de flores margaridas na região. O município se emancipou em 27 de julho de 1962.',
    ],
    facts: [
      'Primeiras salinas: 1881, na Ponta da Margarida.',
      'O técnico português José Soares veio de Aveiro.',
      'Emancipação: Lei Estadual 1.755, de 27/07/1962.',
    ],
    tip: 'Ao caminhar pela orla, repare nos nomes dos lugares: eles guardam pistas da época do sal.',
    links: [
      { label: 'Nossa história', to: '/sobre' },
      { label: 'Profissionais na sede', to: '/localidades/sede' },
    ],
  },
  {
    slug: 'paisagens-para-registrar',
    icon: Camera,
    title: 'Paisagens para registrar',
    text: 'Luz, água, mangue e comunidade em cenários que mudam com a maré.',
    lede: 'Luz, água, mangue e comunidade mudam com a maré. Salinas é um lugar de fotografar devagar.',
    story: [
      'A costa reúne praias de mar calmo, como Barra do Paraguaçu, Cairu, Conceição e Encarnação, além de pontas de areia e manguezais. Cada horário e cada maré oferecem uma composição diferente.',
      'Fotografar aqui é também uma forma de respeitar: pedir licença para retratar pessoas, não entrar em áreas de trabalho sem convite e não deixar resíduos são parte do passeio.',
    ],
    facts: [
      'Praias citadas: Barra, Porto da Telha, Ponta do Dourado, Cairu, Conceição, Encarnação, Pedra Mole e Praia do Amor.',
      'A luz do início da manhã e do fim da tarde é mais suave.',
      'Manguezais e bancos de areia mudam com a maré.',
    ],
    tip: 'Leve bateria extra e proteja o celular da areia e da maresia; o sinal pode ser fraco em alguns povoados.',
    links: [
      { label: 'Conhecer Cairu', to: '/localidades/cairu' },
      { label: 'Barra do Paraguaçu', to: '/localidades/barra-do-paraguacu' },
    ],
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
