-- supabase/migrations/002_seed_la_piece_retrouvee.sql
-- Seed: La pièce retrouvée — first Culte Familial parcours
-- Content sourced from https://minilek.com/la-piece-retrouvee/

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
      'story_text', 'Jésus questionne ses disciples : "Si une femme a normalement 10 pièces d''argent mais voilà qu''elle en perd une. Ne pensez-vous pas qu''elle va allumer la lumière ? Elle va même balayer sa maison et la chercher partout jusqu''à la trouver."

Et une fois sa pièce retrouvée, voilà cette dame qui appelle ses amies et ses voisines : "Réjouissez-vous avec moi, j''avais perdu ma pièce mais je l''ai retrouvée !"

Jésus explique à ses disciples que chaque personne est si précieuse pour Lui, et que Dieu désire tellement prendre soin d''elle, qu''Il va tout faire pour la retrouver.

Et après, ce sera la fête dans le ciel ! Même pour une seule personne qui se repent de ses péchés et choisit de suivre Jésus, les anges sont dans la joie.',
      'prayer_text', 'Chers parents, comme cette dame qui a allumé la lumière et balayé toute sa maison pour retrouver la pièce manquante, faisons de notre mieux pour que l''enfant comprenne que Jésus est aussi mort pour lui/elle, pour ses péchés.

Expliquez-leur que, peu importe ce qu''il ou elle a fait ou fera, Dieu n''abandonnera jamais. Il cherchera toujours sa pièce précieuse.',
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
  array['parabole', 'pardon', 'joie', 'Jésus'],
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
  -- QUESTIONS FACILES (4)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien de pièces a la dame normalement ?',
    'choices', array['5 pièces', '7 pièces', '10 pièces', '12 pièces'],
    'correct_index', 2,
    'explanation', 'Elle a normalement 10 pièces d''argent.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien la dame a-t-elle perdu de pièce(s) ?',
    'choices', array['1 pièce', '2 pièces', '3 pièces', '5 pièces'],
    'correct_index', 0,
    'explanation', 'La dame a perdu 1 seule pièce.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qui raconte cette histoire ?',
    'choices', array['Pierre', 'Paul', 'Jésus', 'Jean-Baptiste'],
    'correct_index', 2,
    'explanation', 'C''est Jésus qui raconte cette histoire à ses disciples.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Est-ce que la dame passe le balai ou l''aspirateur ?',
    'choices', array['L''aspirateur', 'Un chiffon', 'Le balai', 'Ses mains'],
    'correct_index', 2,
    'explanation', 'Elle passe le balai pour chercher sa pièce partout dans la maison.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS MOYENNES (4)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'La dame a-t-elle envie de retrouver sa pièce ?',
    'choices', array['Non, elle abandonne', 'Elle hésite d''abord', 'Elle demande à une amie de chercher', 'Oui, elle cherche partout'],
    'correct_index', 3,
    'explanation', 'Oui ! La dame allume la lumière et balaie toute la maison pour la retrouver.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Cherche-t-elle sa pièce juste 5 minutes ?',
    'choices', array['Oui, seulement 5 minutes', 'Oui, environ une demi-heure', 'Elle arrête quand elle est fatiguée', 'Non, elle cherche partout jusqu''à la trouver'],
    'correct_index', 3,
    'explanation', 'Non, elle allume la lumière, balaie et cherche partout jusqu''à ce qu''elle la retrouve.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que fait la dame quand elle retrouve sa pièce ?',
    'choices', array['Elle remercie Dieu en silence', 'Elle va au temple', 'Elle pleure de joie toute seule', 'Elle appelle ses amies et ses voisines'],
    'correct_index', 3,
    'explanation', 'Elle appelle ses amies et ses voisines pour célébrer avec elles.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi appelle-t-elle ses amies ?',
    'choices', array['Pour leur montrer la pièce', 'Pour leur demander de l''aide', 'Pour les remercier', 'Elle est dans la joie et veut célébrer avec elles'],
    'correct_index', 3,
    'explanation', 'Elle est dans la joie et veut partager cette fête avec ses amies.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS IMPOSSIBLES (4)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel sentiment a la dame lorsqu''elle retrouve sa pièce ?',
    'choices', array['Du soulagement seulement', 'De la fierté', 'De la honte d''avoir perdu', 'De la joie'],
    'correct_index', 3,
    'explanation', 'La dame ressent de la joie.',
    'translation_status', 'source'
  ))),
  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'À qui Jésus compare-t-il les pièces ?',
    'choices', array['Aux anges du ciel', 'Aux richesses du monde', 'Aux étoiles', 'À nous, les personnes'],
    'correct_index', 3,
    'explanation', 'Jésus compare les pièces à nous.',
    'translation_status', 'source'
  ))),
  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Est-ce que Dieu veut nous laisser nous perdre ? Va-t-il nous abandonner ?',
    'choices', array['Oui, si c''est ce qu''on veut', 'Oui, si on est trop loin de lui', 'Ça dépend de nos fautes', 'Non, Dieu fera tout pour nous retrouver'],
    'correct_index', 3,
    'explanation', 'Non, Dieu fera comme cette femme. Il fera tout son possible pour te retrouver, pour que tu crois en Lui, pour que tu te rendes compte qu''il t''aime et de combien tu es précieux/précieuse pour Lui.',
    'translation_status', 'source'
  ))),
  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Les anges et Dieu font-ils la fête dans le ciel quand UNE seule personne se repent ?',
    'choices', array['Non, il faut beaucoup de personnes', 'Seulement si c''est un grand pécheur', 'Seulement les anges, pas Dieu', 'Oui, même pour une seule personne'],
    'correct_index', 3,
    'explanation', 'Oui, même pour une seule personne.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS PARENTS (4)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Dieu et ses anges sont-ils heureux même quand UNE seule personne se repent et choisit Jésus ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', 'C''est la fête parce que chacun d''entre nous est précieux pour Dieu. Il veut tous nous sauver. Et Il veut aussi TE sauver.',
    'translation_status', 'source'
  ))),
  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Est-ce grave si juste une pièce est perdue ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', 'Jésus aime chacun de nous. Nous sommes si précieux qu''il ne veut qu''aucun de nous ne soit perdu. C''est pourquoi Dieu fera tout son possible pour que la personne comprenne que Dieu l''aime et veut la sauver.',
    'translation_status', 'source'
  ))),
  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Peut-on faire quelque chose pour aider Jésus ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', 'Tu peux aider à allumer les lumières et à balayer. Tu peux parler de Jésus autour de toi et prier pour ceux qui ne connaissent pas Jésus. Dieu est reconnaissant et aime que tu travailles avec Lui, mais n''oublie pas que ce que tu ne peux pas faire, c''est transformer le cœur de l''autre et pardonner ses péchés — ça c''est Dieu, par son Saint Esprit, qui s''en occupe.',
    'translation_status', 'source'
  ))),
  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce que ça change d''être une pièce retrouvée ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', 'Tu n''es pas tout seul. Tu es avec d''autres pièces, d''autres chrétiens. Tu appartiens à la famille de Dieu. Tu es si précieux que Dieu dit qu''il t''adopte comme Son enfant. Tu es à Lui pour toujours, il t''aime et ne t''abandonnera jamais !',
    'translation_status', 'source'
  )));

end $$;
