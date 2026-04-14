-- supabase/migrations/002_seed_la_piece_retrouvee.sql
-- Seed: La pièce retrouvée (Luc 15:8-10) — first Culte Familial parcours

insert into parcours (
  slug,
  translations,
  image_url,
  audio_urls,
  tags,
  difficulty,
  tier,
  published
) values (
  'la-piece-retrouvee',
  jsonb_build_object(
    'fr', jsonb_build_object(
      'title', 'La pièce retrouvée',
      'story_text', 'Une femme possédait dix pièces d''argent. Elle en perd une. Alors elle allume une lampe, balaie toute la maison et cherche avec soin jusqu''à ce qu''elle la retrouve.

Quand elle l''a retrouvée, elle appelle ses amies et ses voisines : "Réjouissez-vous avec moi, car j''ai retrouvé la pièce que j''avais perdue !"

Jésus dit : "De même, il y a de la joie devant les anges de Dieu pour un seul pécheur qui se repent."

— Luc 15 : 8-10',
      'prayer_text', 'Seigneur, merci de nous chercher quand nous nous perdons. Comme la femme cherche sa pièce avec soin, tu nous cherches avec amour. Aide-nous à rester proches de toi et à nous réjouir quand ceux qui étaient perdus reviennent vers toi. Amen.',
      'translation_status', 'source'
    )
  ),
  'https://minilek.com/wp-content/uploads/2026/02/la-piece-retrouvee-parabole-de-Jesus-histoire-biblique-pour-enfant-culte-familial-ludique-Minilek-scaled.png',
  jsonb_build_object(
    'generique',  'https://minilek.com/wp-content/uploads/2024/09/Mini-quizz-generique.mp3',
    'facile',     'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-simple.mp3',
    'moyenne',    'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-moyenne.mp3',
    'difficile',  'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-difficile.mp3',
    'parents',    'https://minilek.com/wp-content/uploads/2024/10/Epicness-Musique-minilek-pour-la-question-des-parents-quiz-chretien-ludique.wav',
    'priere',     'https://minilek.com/wp-content/uploads/2024/09/Miniquiz-Piano-priere.mp3',
    'correct',    'https://minilek.com/wp-content/uploads/2024/09/vrai.mp3',
    'wrong',      'https://minilek.com/wp-content/uploads/2024/09/faux.mp3'
  ),
  array['parabole', 'pardon', 'Luc', 'argent'],
  'debutant',
  'free',
  true
);

-- Store parcours id for question inserts
do $$
declare
  p_id uuid;
begin
  select id into p_id from parcours where slug = 'la-piece-retrouvee';

  -- =====================
  -- QUESTIONS FACILES (1-5)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien de pièces d''argent la femme possédait-elle ?',
    'choices', array['5 pièces', '7 pièces', '10 pièces', '12 pièces'],
    'correct_index', 2,
    'explanation', 'Elle possédait 10 pièces d''argent, et en perdit une.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que fait-elle quand elle perd une pièce ?',
    'choices', array['Elle pleure et attend', 'Elle cherche dehors dans la rue', 'Elle allume une lampe et balaie la maison', 'Elle demande à ses voisines de l''aider'],
    'correct_index', 2,
    'explanation', 'Elle allume une lampe et balaie toute la maison avec soin.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Où cherche-t-elle la pièce ?',
    'choices', array['Dans son jardin', 'Dans la rue devant chez elle', 'Dans le temple', 'Dans toute la maison'],
    'correct_index', 3,
    'explanation', 'Elle cherche dans toute la maison jusqu''à la retrouver.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que fait-elle quand elle retrouve la pièce ?',
    'choices', array['Elle remercie Dieu en silence', 'Elle va au temple offrir un sacrifice', 'Elle cache la pièce précieusement', 'Elle appelle ses amies et voisines pour se réjouir'],
    'correct_index', 3,
    'explanation', 'Elle partage sa joie avec toute sa communauté.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qui se réjouit quand un pécheur se repent, selon cette parabole ?',
    'choices', array['Les pharisiens', 'Les disciples de Jésus', 'Les prêtres du temple', 'Les anges de Dieu'],
    'correct_index', 3,
    'explanation', 'Jésus dit qu''il y a de la joie devant les anges de Dieu.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS MOYENNES (6-10)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel livre de la Bible raconte cette histoire ?',
    'choices', array['Matthieu', 'Marc', 'Jean', 'Luc'],
    'correct_index', 3,
    'explanation', 'C''est l''Évangile de Luc qui rapporte cette parabole.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel chapitre du livre de Luc ?',
    'choices', array['Chapitre 10', 'Chapitre 12', 'Chapitre 15', 'Chapitre 18'],
    'correct_index', 2,
    'explanation', 'La parabole se trouve au chapitre 15 de Luc.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce qu''une parabole ?',
    'choices', array['Une prière récitée à la synagogue', 'Un psaume chanté par les lévites', 'Un commandement de la loi de Moïse', 'Une histoire avec un message caché et une leçon spirituelle'],
    'correct_index', 3,
    'explanation', 'Jésus utilisait des histoires du quotidien pour enseigner des vérités spirituelles.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que représente la pièce perdue dans cette parabole ?',
    'choices', array['Les richesses matérielles', 'Le paradis que l''on cherche', 'Le péché lui-même', 'Une personne perdue / un pécheur'],
    'correct_index', 3,
    'explanation', 'La pièce symbolise une personne éloignée de Dieu.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que représente la femme dans cette parabole ?',
    'choices', array['L''Église qui cherche ses membres', 'Marie, mère de Jésus', 'Les pharisiens qui jugent les pécheurs', 'Dieu / Jésus qui cherche les perdus'],
    'correct_index', 3,
    'explanation', 'La femme représente Dieu qui cherche activement chaque personne perdue.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS IMPOSSIBLES (11-13)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quels versets précis du chapitre 15 de Luc racontent cette parabole ?',
    'choices', array['Versets 1 à 7', 'Versets 8 à 10', 'Versets 11 à 24', 'Versets 25 à 32'],
    'correct_index', 1,
    'explanation', 'La parabole de la pièce perdue couvre exactement les versets 8 à 10.',
    'translation_status', 'source'
  ))),
  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Dans la culture de l''époque, que représentait une drachme (pièce d''argent) ?',
    'choices', array['Une offrande au temple', 'Le prix d''un repas pour une famille', 'Le salaire d''une journée de travail', 'Une petite somme sans grande valeur'],
    'correct_index', 2,
    'explanation', 'Une drachme équivalait au salaire d''un journalier pour une journée complète de travail.',
    'translation_status', 'source'
  ))),
  (p_id, 'impossible', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelles sont les deux autres paraboles racontées dans Luc 15 ?',
    'choices', array['Le bon Samaritain et le fils prodigue', 'Le semeur et la brebis perdue', 'La brebis perdue et le fils prodigue', 'La brebis perdue et le pharisien et le publicain'],
    'correct_index', 2,
    'explanation', 'Luc 15 contient trois paraboles : la brebis perdue, la pièce perdue, et le fils prodigue.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS PARENTS (14-16)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment montres-tu à tes enfants que tu les cherches quand ils se perdent (font une bêtise) ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', null::text,
    'translation_status', 'source'
  ))),
  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment expliquer à tes enfants que Dieu ne se décourage jamais de les chercher ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', null::text,
    'translation_status', 'source'
  ))),
  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'As-tu déjà ressenti que Dieu te cherchait dans un moment difficile ? Partage avec ta famille.',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', null::text,
    'translation_status', 'source'
  )));

end $$;
