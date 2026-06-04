import type { Locale } from '@/types/quiz'

export interface HomepageLabels {
  phoneDemo: {
    storyName: string
    question: string
    answer1: string
    answer2: string
  }
  hero: {
    badge: string
    h1line1: string
    h1line2: string
    p: string
    btn1: string
    btn2: string
  }
  manifeste: string
  activities: {
    sectionTitle: string
    sectionSubtitle: string
    availableBadge: string
    soonBadge: string
    cards: [
      { label: string; title: string; desc: string; cta: string },
      { label: string; title: string; desc: string; cta: string },
      { label: string; title: string; desc: string; cta: string },
    ]
  }
  stack: {
    cards: [
      { label: string; title: string; desc: string; btn: string },
      { label: string; title: string; desc: string; btn: string },
      { label: string; title: string; desc: string; btn: string },
    ]
  }
}

const labels: Record<Locale, HomepageLabels> = {
  fr: {
    phoneDemo: {
      storyName: 'Les Mages',
      question: 'Qu\'ont-ils suivi pour trouver Jésus ?',
      answer1: '🌟 Une étoile',
      answer2: '🕊️ Une colombe',
    },
    hero: {
      badge:   '✨ Activités bibliques pour les familles',
      h1line1: 'Explore la Bible',
      h1line2: 'en famille, avec joie',
      p:       'Des quiz interactifs, mots mêlés et coloriages pour grandir dans la foi ensemble — disponible en 4 langues.',
      btn1:    'Commencer →',
      btn2:    'Notre mission',
    },
    manifeste:
      "Minilek accompagne les familles dans des moments vivants et complices autour de la Parole, à travers des activités ludiques et accessibles — parce que la foi s'éveille naturellement quand elle se vit avec simplicité, curiosité et joie, peu importe l'âge ou la langue.",
    activities: {
      sectionTitle:    'Nos activités bibliques',
      sectionSubtitle: 'Des expériences interactives pour explorer la foi en famille',
      availableBadge:  'Disponible',
      soonBadge:       'Bientôt',
      cards: [
        { label: '📖 Activité', title: 'Culte Familial',  desc: 'Quiz bibliques interactifs à vivre ensemble en famille autour des histoires de la Bible.', cta: 'Commencer →' },
        { label: '🔎 Activité', title: 'Mots Mêlés',      desc: 'Retrouve les mots bibliques cachés dans la grille. Jouez ensemble, apprenez en vous amusant !', cta: 'Jouer →' },
        { label: '🎨 Activité', title: 'Coloriage',        desc: 'Des illustrations bibliques à colorier pour les petits artistes de la famille.', cta: 'Bientôt ✨' },
      ],
    },
    stack: {
      cards: [
        { label: 'Activité 01', title: 'Culte Familial', desc: "Quiz bibliques interactifs : histoire, questions, prière, vidéo. En famille, à votre rythme.", btn: 'Jouer maintenant →' },
        { label: 'Activité 02', title: 'Mots Mêlés',     desc: "Des grilles de mots cachés bibliques pour apprendre le vocabulaire de la foi en s'amusant.", btn: 'Chercher →' },
        { label: 'Activité 03', title: 'Coloriage',       desc: 'Des illustrations bibliques à colorier — pour les plus petits comme pour les grands artistes.', btn: 'Bientôt disponible ✨' },
      ],
    },
  },

  en: {
    phoneDemo: {
      storyName: 'The Magi',
      question: 'What did they follow to find Jesus?',
      answer1: '🌟 A star',
      answer2: '🕊️ A dove',
    },
    hero: {
      badge:   '✨ Biblical activities for families',
      h1line1: 'Explore the Bible',
      h1line2: 'as a family, with joy',
      p:       'Interactive quizzes, word searches and coloring pages to grow in faith together — available in 4 languages.',
      btn1:    'Get started →',
      btn2:    'Our mission',
    },
    manifeste:
      'Minilek accompanies families in lively and meaningful moments around the Word, through playful and accessible activities — because faith awakens naturally when it is lived with simplicity, curiosity and joy, whatever the age or language.',
    activities: {
      sectionTitle:    'Our biblical activities',
      sectionSubtitle: 'Interactive experiences to explore faith as a family',
      availableBadge:  'Available',
      soonBadge:       'Coming soon',
      cards: [
        { label: '📖 Activity', title: 'Family Worship', desc: 'Interactive Bible quizzes to enjoy as a family around Bible stories.', cta: 'Start →' },
        { label: '🔎 Activity', title: 'Word Search',     desc: 'Find the biblical words hidden in the grid. Play together, learn while having fun!', cta: 'Play →' },
        { label: '🎨 Activity', title: 'Coloring',        desc: 'Biblical illustrations to color for the little artists in the family.', cta: 'Coming soon ✨' },
      ],
    },
    stack: {
      cards: [
        { label: 'Activity 01', title: 'Family Worship', desc: 'Interactive Bible quizzes: story, questions, prayer, video. As a family, at your own pace.', btn: 'Play now →' },
        { label: 'Activity 02', title: 'Word Search',    desc: 'Biblical word search grids to learn the vocabulary of faith while having fun.', btn: 'Search →' },
        { label: 'Activity 03', title: 'Coloring',       desc: 'Biblical illustrations to color — for the youngest to the greatest artists.', btn: 'Coming soon ✨' },
      ],
    },
  },

  pt: {
    phoneDemo: {
      storyName: 'Os Magos',
      question: 'O que seguiram para encontrar Jesus?',
      answer1: '🌟 Uma estrela',
      answer2: '🕊️ Uma pomba',
    },
    hero: {
      badge:   '✨ Atividades bíblicas para famílias',
      h1line1: 'Explore a Bíblia',
      h1line2: 'em família, com alegria',
      p:       'Quizzes interativos, caça-palavras e páginas para colorir para crescer na fé juntos — disponível em 4 idiomas.',
      btn1:    'Começar →',
      btn2:    'Nossa missão',
    },
    manifeste:
      'O Minilek acompanha as famílias em momentos vivos e cúmplices em torno da Palavra, através de atividades lúdicas e acessíveis — porque a fé desperta naturalmente quando é vivida com simplicidade, curiosidade e alegria, independentemente da idade ou língua.',
    activities: {
      sectionTitle:    'Nossas atividades bíblicas',
      sectionSubtitle: 'Experiências interativas para explorar a fé em família',
      availableBadge:  'Disponível',
      soonBadge:       'Em breve',
      cards: [
        { label: '📖 Atividade', title: 'Culto Familiar', desc: 'Quizzes bíblicos interativos para viver em família em torno das histórias da Bíblia.', cta: 'Começar →' },
        { label: '🔎 Atividade', title: 'Caça-Palavras',  desc: 'Encontre as palavras bíblicas escondidas na grade. Joguem juntos, aprendam se divertindo!', cta: 'Jogar →' },
        { label: '🎨 Atividade', title: 'Colorir',         desc: 'Ilustrações bíblicas para colorir para os pequenos artistas da família.', cta: 'Em breve ✨' },
      ],
    },
    stack: {
      cards: [
        { label: 'Atividade 01', title: 'Culto Familiar', desc: 'Quizzes bíblicos interativos: história, perguntas, oração, vídeo. Em família, no seu ritmo.', btn: 'Jogar agora →' },
        { label: 'Atividade 02', title: 'Caça-Palavras',  desc: 'Grades de caça-palavras bíblicos para aprender o vocabulário da fé se divertindo.', btn: 'Buscar →' },
        { label: 'Atividade 03', title: 'Colorir',         desc: 'Ilustrações bíblicas para colorir — para os menores e os maiores artistas.', btn: 'Em breve ✨' },
      ],
    },
  },

  es: {
    phoneDemo: {
      storyName: 'Los Magos',
      question: '¿Qué siguieron para encontrar a Jesús?',
      answer1: '🌟 Una estrella',
      answer2: '🕊️ Una paloma',
    },
    hero: {
      badge:   '✨ Actividades bíblicas para familias',
      h1line1: 'Explora la Biblia',
      h1line2: 'en familia, con alegría',
      p:       'Cuestionarios interactivos, sopas de letras y páginas para colorear para crecer en la fe juntos — disponible en 5 idiomas.',
      btn1:    'Empezar →',
      btn2:    'Nuestra misión',
    },
    manifeste:
      'Minilek acompaña a las familias en momentos vivos y cómplices alrededor de la Palabra, a través de actividades lúdicas y accesibles — porque la fe despierta naturalmente cuando se vive con sencillez, curiosidad y alegría, sin importar la edad o el idioma.',
    activities: {
      sectionTitle:    'Nuestras actividades bíblicas',
      sectionSubtitle: 'Experiencias interactivas para explorar la fe en familia',
      availableBadge:  'Disponible',
      soonBadge:       'Próximamente',
      cards: [
        { label: '📖 Actividad', title: 'Culto Familiar',   desc: 'Cuestionarios bíblicos interactivos para disfrutar en familia alrededor de las historias de la Biblia.', cta: 'Empezar →' },
        { label: '🔎 Actividad', title: 'Sopa de Letras',   desc: '¡Encuentra las palabras bíblicas escondidas en la cuadrícula. Jugad juntos, aprended divirtiéndoos!', cta: 'Jugar →' },
        { label: '🎨 Actividad', title: 'Colorear',         desc: 'Ilustraciones bíblicas para colorear para los pequeños artistas de la familia.', cta: 'Próximamente ✨' },
      ],
    },
    stack: {
      cards: [
        { label: 'Actividad 01', title: 'Culto Familiar', desc: 'Cuestionarios bíblicos interactivos: historia, preguntas, oración, vídeo. En familia, a vuestro ritmo.', btn: 'Jugar ahora →' },
        { label: 'Actividad 02', title: 'Sopa de Letras', desc: 'Cuadrículas de sopas de letras bíblicas para aprender el vocabulario de la fe divirtiéndose.', btn: 'Buscar →' },
        { label: 'Actividad 03', title: 'Colorear',       desc: 'Ilustraciones bíblicas para colorear — para los más pequeños y los más grandes artistas.', btn: 'Próximamente ✨' },
      ],
    },
  },
  th: {
    phoneDemo: {
      storyName: 'โหราจารย์',
      question: 'พวกเขาติดตามอะไรเพื่อหาพระเยซู?',
      answer1: '🌟 ดาวดวงหนึ่ง',
      answer2: '🕊️ นกพิราบ',
    },
    hero: {
      badge:   '✨ กิจกรรมพระคัมภีร์สำหรับครอบครัว',
      h1line1: 'สำรวจพระคัมภีร์',
      h1line2: 'ในครอบครัว ด้วยความสุข',
      p:       'แบบทดสอบเชิงโต้ตอบ ค้นหาคำ และหน้าระบายสี เพื่อเติบโตในความเชื่อร่วมกัน — มี 4 ภาษา',
      btn1:    'เริ่มต้น →',
      btn2:    'ภารกิจของเรา',
    },
    manifeste:
      'มินิเล็คพาครอบครัวสู่ช่วงเวลาที่มีชีวิตชีวาและมีความหมายรอบพระวจนะ ผ่านกิจกรรมที่สนุกและเข้าถึงได้ — เพราะความเชื่อเกิดขึ้นตามธรรมชาติเมื่อใช้ชีวิตด้วยความเรียบง่าย ความอยากรู้ และความสุข ไม่ว่าอายุหรือภาษา',
    activities: {
      sectionTitle:    'กิจกรรมพระคัมภีร์ของเรา',
      sectionSubtitle: 'ประสบการณ์เชิงโต้ตอบเพื่อสำรวจความเชื่อในครอบครัว',
      availableBadge:  'พร้อมใช้',
      soonBadge:       'เร็วๆ นี้',
      cards: [
        { label: '📖 กิจกรรม', title: 'นมัสการครอบครัว', desc: 'แบบทดสอบพระคัมภีร์เชิงโต้ตอบเพื่อสนุกในครอบครัวรอบเรื่องราวในพระคัมภีร์', cta: 'เริ่ม →' },
        { label: '🔎 กิจกรรม', title: 'ค้นหาคำ',         desc: 'ค้นหาคำพระคัมภีร์ที่ซ่อนอยู่ในตาราง เล่นด้วยกัน เรียนรู้อย่างสนุก!', cta: 'เล่น →' },
        { label: '🎨 กิจกรรม', title: 'ระบายสี',          desc: 'ภาพประกอบพระคัมภีร์สำหรับระบายสีสำหรับศิลปินตัวน้อยในครอบครัว', cta: 'เร็วๆ นี้ ✨' },
      ],
    },
    stack: {
      cards: [
        { label: 'กิจกรรม 01', title: 'นมัสการครอบครัว', desc: 'แบบทดสอบพระคัมภีร์เชิงโต้ตอบ: เรื่องราว คำถาม การอธิษฐาน วิดีโอ ในครอบครัว ตามจังหวะของคุณ', btn: 'เล่นเดี๋ยวนี้ →' },
        { label: 'กิจกรรม 02', title: 'ค้นหาคำ',         desc: 'ตารางค้นหาคำพระคัมภีร์เพื่อเรียนรู้คำศัพท์แห่งความเชื่ออย่างสนุก', btn: 'ค้นหา →' },
        { label: 'กิจกรรม 03', title: 'ระบายสี',          desc: 'ภาพประกอบพระคัมภีร์สำหรับระบายสี — สำหรับศิลปินตัวน้อยและตัวใหญ่', btn: 'เร็วๆ นี้ ✨' },
      ],
    },
  },
}

export function getHomepageLabels(locale: Locale): HomepageLabels {
  return labels[locale] ?? labels.fr
}
