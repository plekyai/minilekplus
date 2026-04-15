-- supabase/migrations/008_seed_guerison_sabbat.sql
-- Seed: L'histoire d'une guérison le jour du sabbat — Culte Familial parcours
-- Source: https://minilek.com / Luc 14

insert into parcours (slug, translations, image_url, youtube_url, audio_urls, tags, difficulty, tier, published)
values (
  'guerison-le-jour-du-sabbat',
  jsonb_build_object('fr', jsonb_build_object(
    'title', 'L''histoire d''une guérison le jour du sabbat',
    'story_text', 'Luc 14

Info au préalable : Le sabbat, c''est un jour particulier dans la semaine que Dieu a instauré avec son peuple, le jour de sabbat, les juifs se reposent, vont à la synagogue et prient Dieu. Mais ils n''ont pas le droit de travailler ou de faire quelque chose qui demande des efforts.

Un jour de sabbat, Jésus entre dans la maison d''un des chefs des pharisiens pour manger, mais il y a là un homme malade. L''eau circule très mal dans son corps et donc ces membres gonflent, c''est douloureux et difficile de se déplacer.

Comme Jésus sait que les pharisiens aiment bien l''embêter, il dit à haute voix : "Est-il permis ou non de faire une guérison le jour du sabbat ? Est-ce que si votre fils ou votre bœuf tombe dans un puits, vous allez le sortir de là même si c''est le sabbat ?"

Personne n''ose répondre. Alors Jésus avance sa main et touche l''homme, le guérit puis lui dit de rentrer chez lui !',
    'prayer_text', 'Cette histoire nous apprend que Jésus veut guérir tous ceux qui sont malades, en tout temps. Il désire nous voir en bonne santé… Et il a le pouvoir de guérir toute personne !

Remercions Dieu pour son amour et sa puissance. Prions pour la santé des membres de notre famille. Prions afin que nous devenons chaque jour un peu plus comme Jésus, à avoir cette compassion et ce zèle pour les autres.',
    'translation_status', 'source'
  )),
  'https://minilek.com/wp-content/uploads/2025/04/culte-familial-ludique-Jesus-guerit-le-jour-du-sabbat-minilek-min.png',
  null,
  jsonb_build_object(
    'generique', 'https://minilek.com/wp-content/uploads/2024/09/Mini-quizz-generique.mp3',
    'facile',    'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-simple.mp3',
    'moyenne',   'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-moyenne.mp3',
    'difficile', 'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-difficile.mp3',
    'parents',   'https://minilek.com/wp-content/uploads/2024/10/Epicness-Musique-minilek-pour-la-question-des-parents-quiz-chretien-ludique.wav',
    'priere',    'https://minilek.com/wp-content/uploads/2024/09/Miniquiz-Piano-priere.mp3',
    'correct',   'https://minilek.com/wp-content/uploads/2024/09/vrai.mp3',
    'wrong',     'https://minilek.com/wp-content/uploads/2024/09/faux.mp3'
  ),
  array['guérison', 'sabbat', 'pharisiens', 'Jésus', 'compassion', 'miracle', 'Luc'],
  'debutant',
  'free',
  true
);

do $$
declare p_id uuid;
begin
  select id into p_id from parcours where slug = 'guerison-le-jour-du-sabbat';

  -- =====================
  -- QUESTIONS FACILES (4)
  -- order_index 0-3
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  -- Facile 0: Jésus guérit-il l'homme ?
  -- Correct answer: Oui, Jésus peut guérir toutes les maladies !
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Jésus guérit-il l''homme malade ?',
    'choices', array[
      'Non, il lui dit de prier',
      'Oui, Jésus peut guérir toutes les maladies !',
      'Non, il l''ignore complètement',
      'Oui, mais seulement après le sabbat'
    ],
    'correct_index', 1,
    'explanation', 'Oui, Jésus peut guérir toutes les maladies ! Il touche l''homme et celui-ci est guéri immédiatement.',
    'translation_status', 'source'
  ))),

  -- Facile 1: Où Jésus est-il invité à manger ?
  -- Correct answer: Il vient manger chez l'un des chefs des pharisiens.
  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Où Jésus est-il invité à manger ?',
    'choices', array[
      'Dans la maison d''un disciple',
      'Au temple de Jérusalem',
      'Chez l''un des chefs des pharisiens',
      'Dans la synagogue du village'
    ],
    'correct_index', 2,
    'explanation', 'Il vient manger chez l''un des chefs des pharisiens. C''est là qu''il rencontre l''homme malade.',
    'translation_status', 'source'
  ))),

  -- Facile 2: Jésus fait-il attention à ne pas déplaire aux pharisiens ?
  -- Correct answer: Non, il s'en fiche. Ce qui est important pour lui, c'est faire le bien.
  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Jésus fait-il attention à ne pas déplaire aux pharisiens ?',
    'choices', array[
      'Oui, il attend leur permission pour agir',
      'Oui, il part sans guérir l''homme',
      'Non, il s''en fiche — ce qui compte pour lui c''est faire le bien',
      'Oui, il guérit l''homme en secret'
    ],
    'correct_index', 2,
    'explanation', 'Non, il s''en fiche. Ce qui est important pour lui, c''est faire le bien, bénir et guérir les personnes qu''il croise.',
    'translation_status', 'source'
  ))),

  -- Facile 3: Quel jour Jésus guérit-il l'homme malade ?
  -- Correct answer: Le jour du sabbat.
  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel jour Jésus guérit-il l''homme malade ?',
    'choices', array[
      'Un dimanche matin',
      'Le jour du sabbat',
      'Un jour de fête nationale',
      'Le lendemain du sabbat'
    ],
    'correct_index', 1,
    'explanation', 'Jésus guérit l''homme le jour du sabbat, ce qui choque les pharisiens.',
    'translation_status', 'source'
  ))),

  -- =====================
  -- QUESTIONS MOYENNES (4)
  -- order_index 4-7
  -- =====================

  -- Moyenne 4: Pourquoi les pharisiens ne veulent pas que Jésus guérisse le jour du sabbat ?
  -- Correct answer: Le jour du sabbat est sacré. Aucun travail pénible ne doit être fait. Pour eux, guérir est un travail.
  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi les pharisiens ne veulent pas que Jésus guérisse le jour du sabbat ?',
    'choices', array[
      'Parce qu''ils n''aiment pas les miracles',
      'Parce que le sabbat est sacré et ils considèrent guérir comme un travail interdit',
      'Parce qu''ils pensent que Jésus n''a pas le pouvoir de guérir',
      'Parce que l''homme malade n''est pas juif'
    ],
    'correct_index', 1,
    'explanation', 'Le jour du sabbat est sacré pour eux. Aucun travail pénible ne doit être fait. Pour les pharisiens, guérir est un travail…',
    'translation_status', 'source'
  ))),

  -- Moyenne 5: Qu'ont répondu les pharisiens ?
  -- Correct answer: Rien du tout, car ils savent que Jésus a raison.
  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''ont répondu les pharisiens à la question de Jésus ?',
    'choices', array[
      'Ils ont dit que Jésus avait tort',
      'Ils ont demandé à Jésus de partir',
      'Rien du tout, car ils savent que Jésus a raison',
      'Ils ont prié avec Jésus'
    ],
    'correct_index', 2,
    'explanation', 'Rien du tout, car ils savent que Jésus a raison. Personne n''ose répondre.',
    'translation_status', 'source'
  ))),

  -- Moyenne 6: Comment Jésus a-t-il guéri l'homme ? (quel geste a-t-il fait ?)
  -- Correct answer: Il a simplement touché l'homme, et celui-ci a été guéri.
  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment Jésus a-t-il guéri l''homme ? Quel geste a-t-il fait ?',
    'choices', array[
      'Il a prié à haute voix pendant longtemps',
      'Il lui a donné une huile spéciale à boire',
      'Il a simplement touché l''homme, et celui-ci a été guéri',
      'Il l''a emmené à la synagogue'
    ],
    'correct_index', 2,
    'explanation', 'Il a simplement touché l''homme, et celui-ci a été guéri. Un simple toucher de Jésus suffit !',
    'translation_status', 'source'
  ))),

  -- Moyenne 7: Jésus guérit-il 6 jours/7 ou 7 jours/7 ?
  -- Correct answer: 7 jours/7 et 24h/24 !
  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Jésus guérit-il 6 jours sur 7 (pas le jour du sabbat) ou 7 jours sur 7 ?',
    'choices', array[
      '6 jours sur 7, il se repose le sabbat',
      'Seulement les jours de fête',
      'Seulement quand les gens le lui demandent',
      '7 jours sur 7 et 24h sur 24 !'
    ],
    'correct_index', 3,
    'explanation', 'Jésus guérit 7 jours/7 et 24h/24 ! Sa puissance et son amour n''ont pas de limite de temps.',
    'translation_status', 'source'
  ))),

  -- ========================
  -- QUESTIONS IMPOSSIBLES (4)
  -- order_index 8-11
  -- ========================

  -- Impossible 8: Pourquoi penses-tu que Jésus a guéri l'homme le jour du sabbat ?
  -- Correct answer: Jésus l'a guéri parce qu'il l'aimait et voulait l'aider.
  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi penses-tu que Jésus a guéri l''homme le jour du sabbat ?',
    'choices', array[
      'Pour provoquer les pharisiens et se battre avec eux',
      'Parce qu''il l''aimait et voulait l''aider',
      'Pour montrer qu''il est plus fort que Moïse',
      'Parce qu''il avait oublié que c''était le sabbat'
    ],
    'correct_index', 1,
    'explanation', 'Jésus l''a guéri parce qu''il l''aimait et voulait l''aider. L''amour de Jésus ne connaît pas de limite de temps.',
    'translation_status', 'source'
  ))),

  -- Impossible 9: Pour aider les pharisiens à comprendre pourquoi il voulait le guérir, quelle image/histoire a-t-il utilisée ?
  -- Correct answer: Si votre fils ou votre bœuf tombe dans un puits, allez-vous le sortir de là même si c'est le sabbat ?
  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pour aider les pharisiens à comprendre, quelle image Jésus a-t-il utilisée ?',
    'choices', array[
      'Un berger qui laisse ses brebis pour retrouver celle qui est perdue',
      'Un père qui accueille son fils après un long voyage',
      'Si votre fils ou votre bœuf tombe dans un puits, allez-vous le sortir même si c''est le sabbat ?',
      'Un grain de blé qui tombe en terre et produit du fruit'
    ],
    'correct_index', 2,
    'explanation', 'Jésus leur a dit : « Si votre fils ou votre bœuf tombe dans un puits, allez-vous le sortir de là même si c''est le sabbat ? » Pour montrer qu''on aide toujours quelqu''un dans le besoin.',
    'translation_status', 'source'
  ))),

  -- Impossible 10: Explique moi ce qu'est le sabbat !
  -- Correct answer: C'est un jour particulier instauré par Dieu, les juifs se reposent, vont à la synagogue et prient. Ils ne travaillent pas.
  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Explique ce qu''est le sabbat !',
    'choices', array[
      'C''est une fête juive célébrée une fois par an pour remercier Dieu',
      'C''est le jour où les juifs vont au marché et font leurs courses',
      'C''est un jour particulier instauré par Dieu où les juifs se reposent, vont à la synagogue et prient, sans travailler',
      'C''est le nom du temple principal à Jérusalem'
    ],
    'correct_index', 2,
    'explanation', 'C''est un jour particulier dans la semaine que Dieu a instauré avec son peuple. Les juifs se reposent, vont à la synagogue et prient Dieu. Mais ils n''ont pas le droit de travailler ou de faire quelque chose qui demande des efforts.',
    'translation_status', 'source'
  ))),

  -- Impossible 11: Comment peux-tu montrer de la compassion à quelqu'un aujourd'hui, comme Jésus l'a fait ?
  -- Correct answer: aider les autres, prendre soin des gens, être attentifs aux soucis des autres. Sourire ou parler à quelqu'un qui semble triste…
  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment peux-tu montrer de la compassion à quelqu''un aujourd''hui, comme Jésus l''a fait ?',
    'choices', array[
      'Seulement en faisant des miracles comme Jésus',
      'En attendant que les adultes s''en occupent',
      'En évitant les gens qui ont des problèmes pour ne pas être triste',
      'En aidant les autres, étant attentif à leurs soucis et en réconfortant ceux qui sont tristes'
    ],
    'correct_index', 3,
    'explanation', 'Comme Jésus, on peut aider les autres, prendre soin des gens autour de nous, être attentifs aux soucis des autres. Sourire ou parler à quelqu''un qui semble triste…',
    'translation_status', 'source'
  ))),

  -- =======================
  -- QUESTIONS PARENTS (4)
  -- order_index 12-15
  -- =======================

  -- Parents 12: Pourquoi Jésus a-t-il comparé l'homme malade à un animal tombé dans un puits ?
  -- Exact answer: Il a utilisé cette comparaison pour leur montrer que les humains ont même plus de valeur qu'un animal...
  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Jésus a-t-il comparé l''homme malade à un animal tombé dans un puits ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Il a utilisé cette comparaison pour leur montrer que les humains ont même plus de valeur qu''un animal. Alors, s''ils sont prêt à le faire pour un animal, pourquoi ne le serait-il pas pour une personne ?!',
    'translation_status', 'source'
  ))),

  -- Parents 13: Pourquoi Jésus a-t-il guérit l'homme même si c'était le jour du sabbat ?
  -- Exact answer: Jésus respectait les règles, mais les religieux comme les pharisiens rajoutaient des obligations inutiles...
  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Jésus a-t-il guérit l''homme même si c''était le jour du sabbat ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Jésus respectait les règles, mais les religieux comme les pharisiens rajoutaient des obligations inutiles… Jésus voulait aider et bénir cet homme de tout son cœur afin que sa vie change, que ce soit le jour du sabbat ou non !',
    'translation_status', 'source'
  ))),

  -- Parents 14: Pourquoi penses-tu que Jésus pose des questions, même s'il connaît déjà les réponses ?
  -- Exact answer: Jésus fait souvent cela pour les aider à réfléchir à leurs actions, leurs paroles...
  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi penses-tu que Jésus pose des questions, même s''il connaît déjà les réponses ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Jésus fait souvent cela pour les aider à réfléchir à leurs actions, leurs paroles. Cela aide parfois à mieux comprendre pourquoi Jésus fait ce qu''il fait. Il désire changer le cœur des hommes pour qu''il soit bon et plein de compassion.',
    'translation_status', 'source'
  ))),

  -- Parents 15: Quand tu vois quelqu'un qui souffre ou qui est triste, qu'est-ce que Jésus aimerait que tu fasses ?
  -- Exact answer: Consoler, aider, prier, défendre,...
  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quand tu vois quelqu''un qui souffre ou qui est triste, qu''est-ce que Jésus aimerait que tu fasses ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Consoler, aider, prier, défendre,…',
    'translation_status', 'source'
  )));

end $$;
