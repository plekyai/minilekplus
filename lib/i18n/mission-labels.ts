import type { Locale } from '@/types/quiz'

export interface MissionLabels {
  credoLabel: string
  credo: string
  valuesLabel: string
  valuesTitle: string
  howTitle: string
  backHome: string
  values: { icon: string; title: string; desc: string }[]
  steps: { num: string; title: string; desc: string; amber?: boolean }[]
}

const labels: Record<Locale, MissionLabels> = {
  fr: {
    credoLabel: 'Notre Credo',
    credo: '« La foi grandit mieux quand on la partage en s\'amusant, en toute langue, à n\'importe quel âge. »',
    valuesLabel: 'Nos valeurs',
    valuesTitle: 'Ce qui nous anime',
    howTitle: 'Comment ça fonctionne ?',
    backHome: '← Retour à l\'accueil',
    values: [
      { icon: '🤲', title: 'Foi',     desc: 'Enracinés dans les Écritures, nous créons du contenu fidèle à la Parole de Dieu.' },
      { icon: '👨‍👩‍👧‍👦', title: 'Famille', desc: 'Chaque activité est pensée pour être vécue ensemble, parents et enfants.' },
      { icon: '🎉', title: 'Joie',    desc: 'Apprendre la Bible doit être fun, mémorable et accessible à tous les âges.' },
      { icon: '🌍', title: 'Langues', desc: 'Disponible en FR, EN, PT et TH — pour les familles du monde entier.' },
    ],
    steps: [
      { num: '01', title: 'Choisissez une histoire biblique',  desc: 'Parcourez notre bibliothèque de cultes familiaux et sélectionnez l\'histoire du jour.' },
      { num: '02', title: 'Explorez ensemble',                 desc: 'Lisez l\'histoire, répondez aux questions, regardez la vidéo et priez ensemble.' },
      { num: '03', title: 'Jouez avec les mots mêlés',        desc: 'Renforcez le vocabulaire biblique avec des grilles de mots cachés ludiques.' },
      { num: '✨', title: 'Bientôt : Coloriage',              desc: 'Des illustrations à colorier viendront compléter l\'expérience pour les plus petits.', amber: true },
    ],
  },

  en: {
    credoLabel: 'Our Creed',
    credo: '"Faith grows best when shared with joy, in any language, at any age."',
    valuesLabel: 'Our values',
    valuesTitle: 'What drives us',
    howTitle: 'How does it work?',
    backHome: '← Back to home',
    values: [
      { icon: '🤲', title: 'Faith',     desc: 'Rooted in Scripture, we create content faithful to the Word of God.' },
      { icon: '👨‍👩‍👧‍👦', title: 'Family',   desc: 'Every activity is designed to be experienced together, parents and children.' },
      { icon: '🎉', title: 'Joy',       desc: 'Learning the Bible should be fun, memorable and accessible at all ages.' },
      { icon: '🌍', title: 'Languages', desc: 'Available in FR, EN, PT and TH — for families around the world.' },
    ],
    steps: [
      { num: '01', title: 'Choose a Bible story',      desc: 'Browse our library of family worship sessions and select the story of the day.' },
      { num: '02', title: 'Explore together',          desc: 'Read the story, answer questions, watch the video and pray together.' },
      { num: '03', title: 'Play word search',          desc: 'Strengthen biblical vocabulary with fun hidden word grids.' },
      { num: '✨', title: 'Coming soon: Coloring',     desc: 'Coloring pages will soon complete the experience for the youngest ones.', amber: true },
    ],
  },

  pt: {
    credoLabel: 'Nosso Credo',
    credo: '"A fé cresce melhor quando compartilhada com alegria, em qualquer idioma, em qualquer idade."',
    valuesLabel: 'Nossos valores',
    valuesTitle: 'O que nos move',
    howTitle: 'Como funciona?',
    backHome: '← Voltar ao início',
    values: [
      { icon: '🤲', title: 'Fé',      desc: 'Enraizados nas Escrituras, criamos conteúdo fiel à Palavra de Deus.' },
      { icon: '👨‍👩‍👧‍👦', title: 'Família', desc: 'Cada atividade é pensada para ser vivida juntos, pais e filhos.' },
      { icon: '🎉', title: 'Alegria', desc: 'Aprender a Bíblia deve ser divertido, memorável e acessível a todas as idades.' },
      { icon: '🌍', title: 'Idiomas', desc: 'Disponível em FR, EN, PT e TH — para famílias de todo o mundo.' },
    ],
    steps: [
      { num: '01', title: 'Escolha uma história bíblica',   desc: 'Navegue pela nossa biblioteca de cultos familiares e selecione a história do dia.' },
      { num: '02', title: 'Explore juntos',                 desc: 'Leia a história, responda às perguntas, assista ao vídeo e orem juntos.' },
      { num: '03', title: 'Jogue caça-palavras',            desc: 'Fortaleça o vocabulário bíblico com grades de palavras escondidas divertidas.' },
      { num: '✨', title: 'Em breve: Colorir',              desc: 'Páginas para colorir em breve completarão a experiência para os mais novos.', amber: true },
    ],
  },

  es: {
    credoLabel: 'Nuestro Credo',
    credo: '"La fe crece mejor cuando se comparte con alegría, en cualquier idioma, a cualquier edad."',
    valuesLabel: 'Nuestros valores',
    valuesTitle: 'Lo que nos mueve',
    howTitle: '¿Cómo funciona?',
    backHome: '← Volver al inicio',
    values: [
      { icon: '🤲', title: 'Fe',      desc: 'Arraigados en las Escrituras, creamos contenido fiel a la Palabra de Dios.' },
      { icon: '👨‍👩‍👧‍👦', title: 'Familia', desc: 'Cada actividad está pensada para vivirla juntos, padres e hijos.' },
      { icon: '🎉', title: 'Alegría', desc: 'Aprender la Biblia debe ser divertido, memorable y accesible a todas las edades.' },
      { icon: '🌍', title: 'Idiomas', desc: 'Disponible en FR, EN, PT, TH y ES — para las familias de todo el mundo.' },
    ],
    steps: [
      { num: '01', title: 'Elige una historia bíblica',    desc: 'Explora nuestra biblioteca de cultos familiares y selecciona la historia del día.' },
      { num: '02', title: 'Explora juntos',                desc: 'Lee la historia, responde las preguntas, mira el vídeo y oren juntos.' },
      { num: '03', title: 'Juega la sopa de letras',       desc: 'Refuerza el vocabulario bíblico con cuadrículas de palabras escondidas.' },
      { num: '✨', title: 'Próximamente: Colorear',        desc: 'Las páginas para colorear pronto completarán la experiencia para los más pequeños.', amber: true },
    ],
  },
  th: {
    credoLabel: 'คำสารภาพของเรา',
    credo: '"ความเชื่อเติบโตได้ดีที่สุดเมื่อแบ่งปันด้วยความสุข ในทุกภาษา ทุกวัย"',
    valuesLabel: 'ค่านิยมของเรา',
    valuesTitle: 'สิ่งที่ขับเคลื่อนเรา',
    howTitle: 'ใช้งานอย่างไร?',
    backHome: '← กลับหน้าแรก',
    values: [
      { icon: '🤲', title: 'ความเชื่อ',  desc: 'ยึดมั่นในพระคัมภีร์ เราสร้างเนื้อหาที่ซื่อสัตย์ต่อพระวจนะของพระเจ้า' },
      { icon: '👨‍👩‍👧‍👦', title: 'ครอบครัว', desc: 'ทุกกิจกรรมออกแบบมาเพื่อสัมผัสร่วมกัน ทั้งพ่อแม่และลูก' },
      { icon: '🎉', title: 'ความสุข',   desc: 'การเรียนรู้พระคัมภีร์ควรสนุก น่าจดจำ และเข้าถึงได้ทุกวัย' },
      { icon: '🌍', title: 'ภาษา',      desc: 'มีให้ใช้งานใน FR, EN, PT และ TH — สำหรับครอบครัวทั่วโลก' },
    ],
    steps: [
      { num: '01', title: 'เลือกเรื่องราวในพระคัมภีร์', desc: 'เรียกดูคลังนมัสการครอบครัวของเราและเลือกเรื่องราวประจำวัน' },
      { num: '02', title: 'สำรวจร่วมกัน',             desc: 'อ่านเรื่องราว ตอบคำถาม ดูวิดีโอ และอธิษฐานร่วมกัน' },
      { num: '03', title: 'เล่นค้นหาคำ',              desc: 'เสริมสร้างคำศัพท์พระคัมภีร์ด้วยตารางค้นหาคำที่สนุกสนาน' },
      { num: '✨', title: 'เร็วๆ นี้: ระบายสี',       desc: 'หน้าระบายสีจะมาเร็วๆ นี้เพื่อเติมเต็มประสบการณ์สำหรับเด็กเล็ก', amber: true },
    ],
  },
}

export function getMissionLabels(locale: Locale): MissionLabels {
  return labels[locale] ?? labels.fr
}
