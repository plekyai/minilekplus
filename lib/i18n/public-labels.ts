import type { Locale } from '@/types/quiz'

export interface HeroPageConfig {
  title: string
  subtitle: string
  breadcrumb: string
}

export interface NavLabels {
  activities: string
  minilek: string
  followUs: string
  culteFamilial: string
  motsMeles: string
  coloriage: string
  notreMission: string
  videotheque: string
}

export interface PlaymobilLabels {
  latestReleases: string
  allStories: string
  podcastLabel: string
  watch: string
  moreInfo: string
  searchPlaceholder: string
  noResults: string
  loadingDesc: string
  sectionTitle: string
  viewAll: string
}

export interface PublicLabels {
  // Navigation
  home: string
  nav: NavLabels
  // Home page
  homeSubtitle: string
  culteFamilialTitle: string
  culteFamilialDesc: string
  motsMelesTitle: string
  motsMelesDesc: string
  colorTitle: string
  colorDesc: string
  comingSoon: string
  // Culte familial list page
  culteFamilialPageTitle: string
  culteFamilialPageSubtitle: string
  noParcours: string
  // Difficulty labels
  difficulty: { debutant: string; intermediaire: string; avance: string }
  // Inner page hero configs (keyed by route slug)
  heroPages: Record<string, HeroPageConfig>
  playmobil: PlaymobilLabels
}

const labels: Record<Locale, PublicLabels> = {
  fr: {
    home: 'Accueil',
    nav: {
      activities: 'Activités',
      minilek: 'Minilek',
      followUs: 'Nous suivre',
      culteFamilial: 'Culte Familial',
      motsMeles: 'Mots Mêlés',
      coloriage: 'Coloriage',
      notreMission: 'Notre Mission',
      videotheque: 'Vidéothèque',
    },
    homeSubtitle: 'Activités bibliques pour la famille',
    culteFamilialTitle: 'Culte Familial',
    culteFamilialDesc: 'Quiz biblique interactif en famille',
    motsMelesTitle: 'Mots Mêlés',
    motsMelesDesc: 'Mots cachés bibliques',
    colorTitle: 'Coloriage',
    colorDesc: 'Bientôt disponible',
    comingSoon: 'Bientôt disponible',
    culteFamilialPageTitle: 'Culte Familial',
    culteFamilialPageSubtitle: 'Des histoires bibliques interactives pour toute la famille.',
    noParcours: 'Aucun parcours disponible pour le moment.',
    difficulty: { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' },
    heroPages: {
      'culte-familial': {
        title: '📖 Culte Familial',
        subtitle: 'Des histoires bibliques interactives à vivre ensemble. Choisissez un parcours et explorez la Parole.',
        breadcrumb: 'Culte Familial',
      },
      'mots-meles': {
        title: '🔎 Mots Mêlés',
        subtitle: 'Retrouve les mots bibliques cachés dans la grille. Cherche horizontalement, verticalement et en diagonale !',
        breadcrumb: 'Mots Mêlés',
      },
      'coloriage': {
        title: '🎨 Coloriage',
        subtitle: 'Des illustrations bibliques à colorier. Pour les petits artistes de la famille !',
        breadcrumb: 'Coloriage',
      },
      'notre-mission': {
        title: 'Notre Mission',
        subtitle: 'Aider les familles à explorer la Bible ensemble — avec joie, simplicité et profondeur.',
        breadcrumb: 'Notre Mission',
      },
    },
    playmobil: {
      latestReleases: 'Dernières sorties',
      allStories: 'Toutes les histoires',
      podcastLabel: 'Le temps des Mini\'',
      watch: 'Regarder',
      moreInfo: 'Plus d\'infos',
      searchPlaceholder: 'Rechercher une histoire...',
      noResults: 'Aucune vidéo trouvée',
      loadingDesc: 'Traduction en cours...',
      sectionTitle: 'Vidéothèque',
      viewAll: 'Voir toutes →',
    },
  },
  en: {
    home: 'Home',
    nav: {
      activities: 'Activities',
      minilek: 'Minilek',
      followUs: 'Follow us',
      culteFamilial: 'Family Worship',
      motsMeles: 'Word Search',
      coloriage: 'Coloring',
      notreMission: 'Our Mission',
      videotheque: 'Video Library',
    },
    homeSubtitle: 'Biblical activities for the family',
    culteFamilialTitle: 'Family Worship',
    culteFamilialDesc: 'Interactive biblical quiz for the family',
    motsMelesTitle: 'Word Search',
    motsMelesDesc: 'Biblical hidden words',
    colorTitle: 'Coloring',
    colorDesc: 'Coming soon',
    comingSoon: 'Coming soon',
    culteFamilialPageTitle: 'Family Worship',
    culteFamilialPageSubtitle: 'Interactive Bible stories for the whole family.',
    noParcours: 'No stories available yet.',
    difficulty: { debutant: 'Beginner', intermediaire: 'Intermediate', avance: 'Advanced' },
    heroPages: {
      'culte-familial': {
        title: '📖 Family Worship',
        subtitle: 'Interactive Bible stories to experience together. Choose a path and explore the Word.',
        breadcrumb: 'Family Worship',
      },
      'mots-meles': {
        title: '🔎 Word Search',
        subtitle: 'Find the hidden biblical words in the grid. Search horizontally, vertically, and diagonally!',
        breadcrumb: 'Word Search',
      },
      'coloriage': {
        title: '🎨 Coloring',
        subtitle: 'Biblical illustrations to color. For the little artists in the family!',
        breadcrumb: 'Coloring',
      },
      'notre-mission': {
        title: 'Our Mission',
        subtitle: 'Helping families explore the Bible together — with joy, simplicity, and depth.',
        breadcrumb: 'Our Mission',
      },
    },
    playmobil: {
      latestReleases: 'Latest Releases',
      allStories: 'All Stories',
      podcastLabel: 'Le temps des Mini\'',
      watch: 'Watch',
      moreInfo: 'More Info',
      searchPlaceholder: 'Search a story...',
      noResults: 'No videos found',
      loadingDesc: 'Translating...',
      sectionTitle: 'Video Library',
      viewAll: 'See all →',
    },
  },
  pt: {
    home: 'Início',
    nav: {
      activities: 'Atividades',
      minilek: 'Minilek',
      followUs: 'Siga-nos',
      culteFamilial: 'Culto Familiar',
      motsMeles: 'Caça-Palavras',
      coloriage: 'Colorir',
      notreMission: 'Nossa Missão',
      videotheque: 'Videoteca',
    },
    homeSubtitle: 'Atividades bíblicas para a família',
    culteFamilialTitle: 'Culto Familiar',
    culteFamilialDesc: 'Quiz bíblico interativo em família',
    motsMelesTitle: 'Caça-Palavras',
    motsMelesDesc: 'Palavras bíblicas escondidas',
    colorTitle: 'Colorir',
    colorDesc: 'Em breve',
    comingSoon: 'Em breve',
    culteFamilialPageTitle: 'Culto Familiar',
    culteFamilialPageSubtitle: 'Histórias bíblicas interativas para toda a família.',
    noParcours: 'Nenhuma história disponível no momento.',
    difficulty: { debutant: 'Iniciante', intermediaire: 'Intermediário', avance: 'Avançado' },
    heroPages: {
      'culte-familial': {
        title: '📖 Culto Familiar',
        subtitle: 'Histórias bíblicas interativas para vivenciar juntos. Escolha um percurso e explore a Palavra.',
        breadcrumb: 'Culto Familiar',
      },
      'mots-meles': {
        title: '🔎 Caça-Palavras',
        subtitle: 'Encontre as palavras bíblicas escondidas na grade. Procure na horizontal, vertical e diagonal!',
        breadcrumb: 'Caça-Palavras',
      },
      'coloriage': {
        title: '🎨 Colorir',
        subtitle: 'Ilustrações bíblicas para colorir. Para os pequenos artistas da família!',
        breadcrumb: 'Colorir',
      },
      'notre-mission': {
        title: 'Nossa Missão',
        subtitle: 'Ajudar famílias a explorar a Bíblia juntas — com alegria, simplicidade e profundidade.',
        breadcrumb: 'Nossa Missão',
      },
    },
    playmobil: {
      latestReleases: 'Últimos lançamentos',
      allStories: 'Todas as histórias',
      podcastLabel: 'Le temps des Mini\'',
      watch: 'Assistir',
      moreInfo: 'Mais info',
      searchPlaceholder: 'Pesquisar uma história...',
      noResults: 'Nenhum vídeo encontrado',
      loadingDesc: 'Traduzindo...',
      sectionTitle: 'Videoteca',
      viewAll: 'Ver todas →',
    },
  },
  es: {
    home: 'Inicio',
    nav: {
      activities: 'Actividades',
      minilek: 'Minilek',
      followUs: 'Síguenos',
      culteFamilial: 'Culto Familiar',
      motsMeles: 'Sopa de Letras',
      coloriage: 'Colorear',
      notreMission: 'Nuestra Misión',
      videotheque: 'Videoteca',
    },
    homeSubtitle: 'Actividades bíblicas para la familia',
    culteFamilialTitle: 'Culto Familiar',
    culteFamilialDesc: 'Cuestionario bíblico interactivo en familia',
    motsMelesTitle: 'Sopa de Letras',
    motsMelesDesc: 'Palabras bíblicas escondidas',
    colorTitle: 'Colorear',
    colorDesc: 'Próximamente',
    comingSoon: 'Próximamente',
    culteFamilialPageTitle: 'Culto Familiar',
    culteFamilialPageSubtitle: 'Historias bíblicas interactivas para toda la familia.',
    noParcours: 'No hay historias disponibles por el momento.',
    difficulty: { debutant: 'Principiante', intermediaire: 'Intermedio', avance: 'Avanzado' },
    heroPages: {
      'culte-familial': {
        title: '📖 Culto Familiar',
        subtitle: 'Historias bíblicas interactivas para vivir juntos. Elige un recorrido y explora la Palabra.',
        breadcrumb: 'Culto Familiar',
      },
      'mots-meles': {
        title: '🔎 Sopa de Letras',
        subtitle: '¡Encuentra las palabras bíblicas escondidas en la cuadrícula. Busca horizontal, vertical y diagonalmente!',
        breadcrumb: 'Sopa de Letras',
      },
      'coloriage': {
        title: '🎨 Colorear',
        subtitle: '¡Ilustraciones bíblicas para colorear. Para los pequeños artistas de la familia!',
        breadcrumb: 'Colorear',
      },
      'notre-mission': {
        title: 'Nuestra Misión',
        subtitle: 'Ayudar a las familias a explorar la Biblia juntas — con alegría, sencillez y profundidad.',
        breadcrumb: 'Nuestra Misión',
      },
    },
    playmobil: {
      latestReleases: 'Últimas entregas',
      allStories: 'Todas las historias',
      podcastLabel: 'Le temps des Mini\'',
      watch: 'Ver',
      moreInfo: 'Más info',
      searchPlaceholder: 'Buscar una historia...',
      noResults: 'No se encontraron vídeos',
      loadingDesc: 'Traduciendo...',
      sectionTitle: 'Videoteca',
      viewAll: 'Ver todas →',
    },
  },
  th: {
    home: 'หน้าแรก',
    nav: {
      activities: 'กิจกรรม',
      minilek: 'Minilek',
      followUs: 'ติดตามเรา',
      culteFamilial: 'นมัสการครอบครัว',
      motsMeles: 'ค้นหาคำ',
      coloriage: 'ระบายสี',
      notreMission: 'พันธกิจของเรา',
      videotheque: 'คลังวิดีโอ',
    },
    homeSubtitle: 'กิจกรรมพระคัมภีร์สำหรับครอบครัว',
    culteFamilialTitle: 'นมัสการครอบครัว',
    culteFamilialDesc: 'แบบทดสอบพระคัมภีร์แบบโต้ตอบสำหรับครอบครัว',
    motsMelesTitle: 'ค้นหาคำ',
    motsMelesDesc: 'คำพระคัมภีร์ที่ซ่อนอยู่',
    colorTitle: 'ระบายสี',
    colorDesc: 'เร็วๆ นี้',
    comingSoon: 'เร็วๆ นี้',
    culteFamilialPageTitle: 'นมัสการครอบครัว',
    culteFamilialPageSubtitle: 'เรื่องราวในพระคัมภีร์เชิงโต้ตอบสำหรับทั้งครอบครัว',
    noParcours: 'ยังไม่มีเรื่องราวในขณะนี้',
    difficulty: { debutant: 'เริ่มต้น', intermediaire: 'กลาง', avance: 'ขั้นสูง' },
    heroPages: {
      'culte-familial': {
        title: '📖 นมัสการครอบครัว',
        subtitle: 'เรื่องราวในพระคัมภีร์เชิงโต้ตอบเพื่อสัมผัสร่วมกัน เลือกเส้นทางและสำรวจพระวจนะ',
        breadcrumb: 'นมัสการครอบครัว',
      },
      'mots-meles': {
        title: '🔎 ค้นหาคำ',
        subtitle: 'ค้นหาคำพระคัมภีร์ที่ซ่อนอยู่ในตาราง ค้นหาตามแนวนอน แนวตั้ง และแนวทแยง!',
        breadcrumb: 'ค้นหาคำ',
      },
      'coloriage': {
        title: '🎨 ระบายสี',
        subtitle: 'ภาพประกอบพระคัมภีร์สำหรับระบายสี สำหรับศิลปินตัวน้อยในครอบครัว!',
        breadcrumb: 'ระบายสี',
      },
      'notre-mission': {
        title: 'พันธกิจของเรา',
        subtitle: 'ช่วยให้ครอบครัวสำรวจพระคัมภีร์ร่วมกัน — ด้วยความยินดี ความเรียบง่าย และความลึกซึ้ง',
        breadcrumb: 'พันธกิจของเรา',
      },
    },
    playmobil: {
      latestReleases: 'ล่าสุด',
      allStories: 'ทุกเรื่องราว',
      podcastLabel: 'Le temps des Mini\'',
      watch: 'ดู',
      moreInfo: 'ข้อมูลเพิ่มเติม',
      searchPlaceholder: 'ค้นหาเรื่องราว...',
      noResults: 'ไม่พบวิดีโอ',
      loadingDesc: 'กำลังแปล...',
      sectionTitle: 'คลังวิดีโอ',
      viewAll: 'ดูทั้งหมด →',
    },
  },
}

export function getPublicLabels(locale: Locale): PublicLabels {
  return labels[locale] ?? labels.fr
}
