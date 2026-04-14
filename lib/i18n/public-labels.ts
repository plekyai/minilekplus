import type { Locale } from '@/types/quiz'

export interface PublicLabels {
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
}

const labels: Record<Locale, PublicLabels> = {
  fr: {
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
  },
  en: {
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
  },
  pt: {
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
  },
  th: {
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
  },
}

export function getPublicLabels(locale: Locale): PublicLabels {
  return labels[locale] ?? labels.fr
}
