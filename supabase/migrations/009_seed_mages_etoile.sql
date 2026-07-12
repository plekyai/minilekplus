-- supabase/migrations/009_seed_mages_etoile.sql
-- Seed: L'histoire des mages qui suivent l'étoile brillante — Culte Familial parcours
-- Source: https://minilek.com/lhistoire-des-mages-qui-suivent-letoile-brillante-minilek/
-- Référence : Matthieu 2 : 1-12

insert into parcours (slug, translations, image_url, youtube_url, audio_urls, tags, difficulty, tier, published)
values (
  'les-mages-suivent-letoile',
  jsonb_build_object('fr', jsonb_build_object(
    'title', 'L''histoire des mages qui suivent l''étoile brillante',
    'story_text', 'Matthieu 2 : 1-12

En Israël, à Bethléem vient de naître une personne très importante : Jésus !

Très loin de là, en Orient, habitent des mages. (Les mages sont des prêtres de l''orient qui étudient le ciel, les étoiles et la science.)
Ils observent une étoile très brillante qui avance en direction d''Israël.
Comprenant qu''un événement important vient de se produire, ils décident de la suivre ! Chaque nuit, l''étoile les guide.

Après un très long voyage, les mages arrivent à Jérusalem pour parler au roi Hérode.
"Où est le roi des Juifs qui vient de naître ? – demandent-ils. – Car nous avons vu son étoile en Orient, et nous sommes venus pour l''adorer."
Le roi Hérode est très surpris. Qui est donc ce Roi dont les mages parlent ?

La nuit venue, les mages aperçoivent de nouveau l''étoile qui, cette fois-ci, s''arrête au-dessus de la maison où l''enfant Jésus est né.
À ce spectacle, ils sont remplis d''une grande joie ! Ça y est, leur voyage est terminé ! Dieu les a guidés jusqu''au bout !

Les mages entrent dans l''étable et voient Jésus dans les bras de Marie, sa mère.
Les voilà qui se prosternent et adorent Jésus.
Ils offrent ensuite des cadeaux spéciaux pour fêter la naissance de Jésus, le Roi : de l''or, de l''encens et la myrrhe.',
    'prayer_text', 'Cette histoire nous apprend que Dieu désire que tout le monde rencontre Jésus, le Sauveur. Et pour cela, il a même utilisé une étoile brillante !

Prions pour que, parents, nous puissions guider nos enfants chaque jour un peu plus vers Jésus.
Prions avec nos enfants pour que Dieu nous guide sur ce chemin spirituel.
Prions que Dieu se révèle à chaque membre de notre famille, comme Il s''est révélé aux mages.
Prions afin que nous puissions toujours chercher Jésus.',
    'translation_status', 'source'
  )),
  'https://minilek.com/wp-content/uploads/2025/04/culte-familial-ludique-minilek-les-mages-suivent-letoile-histoire-biblique-pour-enfant-min.png',
  'https://www.youtube.com/watch?v=Hwvd7UmYqOg',
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
  array['mages', 'étoile', 'Noël', 'naissance', 'Jésus', 'Matthieu', 'adoration', 'Orient'],
  'debutant',
  'free',
  true
);

do $$
declare p_id uuid;
begin
  select id into p_id from parcours where slug = 'les-mages-suivent-letoile';

  -- =====================
  -- QUESTIONS FACILES (4)
  -- order_index 0-3
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  -- Facile 0
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que suivent les mages pour trouver Jésus ?',
    'choices', array[
      'Un ange dans le ciel',
      'Une colombe blanche',
      'Une étoile brillante',
      'Une carte dessinée par Hérode'
    ],
    'correct_index', 2,
    'explanation', 'Les mages suivent une étoile très brillante qui avance en direction d''Israël. Chaque nuit, l''étoile les guide.',
    'translation_status', 'source'
  ))),

  -- Facile 1
  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'D''où viennent les mages ?',
    'choices', array[
      'De Bethléem',
      'D''Orient',
      'De Jérusalem',
      'D''Égypte'
    ],
    'correct_index', 1,
    'explanation', 'Les mages habitent très loin, en Orient. Ils ne viennent pas du même pays qu''Israël.',
    'translation_status', 'source'
  ))),

  -- Facile 2
  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qui les mages veulent-ils rencontrer ?',
    'choices', array[
      'Le roi Hérode',
      'Jean-Baptiste',
      'Le grand prêtre du temple',
      'Jésus, le Roi des Juifs'
    ],
    'correct_index', 3,
    'explanation', 'Les mages cherchent Jésus, le Roi des Juifs qui vient de naître.',
    'translation_status', 'source'
  ))),

  -- Facile 3
  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Les mages trouvent-ils Jésus facilement dès leur arrivée ?',
    'choices', array[
      'Oui, l''étoile les guide directement jusqu''à lui',
      'Non, ils parlent d''abord au roi Hérode',
      'Oui, les bergers leur indiquent le chemin',
      'Non, ils restent perdus pendant des mois'
    ],
    'correct_index', 1,
    'explanation', 'Non, en arrivant à Jérusalem, ils vont d''abord parler au roi Hérode pour demander où est né le Roi des Juifs.',
    'translation_status', 'source'
  ))),

  -- =====================
  -- QUESTIONS MOYENNES (4)
  -- order_index 4-7
  -- =====================

  -- Moyenne 4
  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Vrai ou Faux : Jésus est le fils du roi Hérode.',
    'choices', array[
      'Vrai, Hérode est son père terrestre',
      'Faux, Jésus est le Fils de Dieu — ses parents sur terre sont Marie et Joseph',
      'Vrai, mais Hérode ne le sait pas encore',
      'On ne sait pas, la Bible ne le dit pas'
    ],
    'correct_index', 1,
    'explanation', 'Faux ! Hérode ne sait pas qui est Jésus. Jésus est le Fils de Dieu, et ses parents sur terre sont Marie et Joseph.',
    'translation_status', 'source'
  ))),

  -- Moyenne 5
  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce qu''un mage ?',
    'choices', array[
      'Un soldat de l''armée du roi',
      'Un magicien qui fait des tours de magie',
      'Un berger qui garde les moutons',
      'Un prêtre d''Orient qui étudie le ciel, les étoiles et la science'
    ],
    'correct_index', 3,
    'explanation', 'Un mage est un prêtre de l''orient qui étudie le ciel, les étoiles et la science.',
    'translation_status', 'source'
  ))),

  -- Moyenne 6
  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que font les mages en voyant Jésus ?',
    'choices', array[
      'Ils repartent immédiatement sans s''arrêter',
      'Ils pleurent de peur et s''enfuient',
      'Ils se prosternent, adorent Jésus et lui offrent des cadeaux',
      'Ils demandent à Hérode la permission d''entrer'
    ],
    'correct_index', 2,
    'explanation', 'Les mages se prosternent et adorent Jésus. Puis ils lui offrent des cadeaux précieux : de l''or, de l''encens et la myrrhe.',
    'translation_status', 'source'
  ))),

  -- Moyenne 7
  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Dans quelle ville est né Jésus ?',
    'choices', array[
      'Jérusalem',
      'Nazareth',
      'Bethléem',
      'En Orient'
    ],
    'correct_index', 2,
    'explanation', 'Jésus est né à Bethléem, en Israël.',
    'translation_status', 'source'
  ))),

  -- ========================
  -- QUESTIONS IMPOSSIBLES (4)
  -- order_index 8-11
  -- ========================

  -- Impossible 8
  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi les mages ont-ils décidé de suivre cette étoile ?',
    'choices', array[
      'Parce qu''Hérode leur avait ordonné de la suivre',
      'Par curiosité, comme un jeu',
      'Elle brillait fort et ils savaient qu''un événement très important venait de se passer',
      'Parce qu''ils cherchaient un trésor caché'
    ],
    'correct_index', 2,
    'explanation', 'L''étoile brillait tellement fort que les mages ont compris qu''un événement important venait de se produire. Ils ont fait confiance à ce signe et décidé de la suivre !',
    'translation_status', 'source'
  ))),

  -- Impossible 9
  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qui a placé cette étoile brillante dans le ciel pour guider les mages ?',
    'choices', array[
      'Les mages eux-mêmes, grâce à leurs sciences',
      'Le roi Hérode pour attirer les mages',
      'Des anges qui voulaient jouer',
      'C''est Dieu ! Il voulait qu''ils rencontrent Jésus, le Roi des rois'
    ],
    'correct_index', 3,
    'explanation', 'C''est Dieu qui a placé cette étoile ! Il voulait que les mages rencontrent Jésus, le Roi des rois. Dieu guide tous ceux qui cherchent sincèrement Jésus.',
    'translation_status', 'source'
  ))),

  -- Impossible 10
  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Dieu a guidé les mages avec une étoile. Comment nous guide-t-il aujourd''hui ?',
    'choices', array[
      'Il ne nous guide plus depuis la naissance de Jésus',
      'Seulement par des rêves la nuit',
      'Uniquement par des étoiles, comme pour les mages',
      'Par la Bible, le Saint Esprit et des personnes de confiance autour de nous'
    ],
    'correct_index', 3,
    'explanation', 'Dieu nous guide aujourd''hui par la Bible qui est sa Parole, par son Saint Esprit qui brille en nous, et aussi par des personnes chrétiennes de confiance qui nous encouragent à connaître Jésus.',
    'translation_status', 'source'
  ))),

  -- Impossible 11
  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'D''après cette histoire, pourquoi chercher Jésus est-il si important ?',
    'choices', array[
      'Pour obtenir des cadeaux comme les mages',
      'Pour plaire aux parents et à l''école du dimanche',
      'Ce n''est pas si important, on peut vivre sans le chercher',
      'Parce que Jésus est le Fils de Dieu venu nous sauver — le trouver, c''est le vrai trésor !'
    ],
    'correct_index', 3,
    'explanation', 'Les mages ont fait un très long voyage pour trouver Jésus. Ce désir était si fort qu''ils ont tout quitté. Trouver Jésus, croire en Lui et vivre pour Lui est un véritable trésor ! Jésus est le Fils de Dieu venu sur terre pour nous sauver.',
    'translation_status', 'source'
  ))),

  -- =======================
  -- QUESTIONS PARENTS (4)
  -- order_index 12-15
  -- =======================

  -- Parents 12
  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Est-ce que les mages étaient juifs comme Marie et Joseph (et Jésus) ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Non, pas du tout ! Les mages venaient d''Orient — ils n''étaient pas juifs. Pourtant, Dieu les a appelés à rencontrer Jésus, le Roi des Juifs et le Sauveur du monde. Cela montre que Jésus est venu pour TOUT le monde, pas seulement pour un peuple.',
    'translation_status', 'source'
  ))),

  -- Parents 13
  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Dieu a-t-il guidé des non-juifs vers Jésus ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Dans la Bible il est écrit : « Dieu n''a pas envoyé son Fils dans le monde pour qu''il juge le monde, mais pour que le monde soit sauvé par lui. » (Jean 3:17) Dieu veut sauver tout le monde — les juifs et tous les autres ! Dès la naissance de Jésus, il confirme son désir et montre son amour pour toutes ses créatures.',
    'translation_status', 'source'
  ))),

  -- Parents 14
  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce qui peut être, dans notre vie de tous les jours, l''étoile qui nous guide vers Jésus ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'La Bible, car elle est la Parole de Dieu. Le Saint Esprit est aussi la lumière qui brille en nous, qui nous guide, nous conseille et nous console au quotidien. Cela peut aussi être un proche chrétien qui nous encourage à toujours plus connaître Dieu.',
    'translation_status', 'source'
  ))),

  -- Parents 15
  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment peut-on suivre Dieu comme les mages ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Les mages ont été attentifs. Ils ont fait confiance à l''étoile. Ils ont persévéré et fait des efforts durant leur voyage. Ils étaient reconnaissants — les cadeaux. Et ils ont adoré le Dieu Très Haut !

Aujourd''hui, nous pouvons lire la Bible car elle est la Parole de Dieu. Nous devons être attentifs à ce que Dieu veut nous dire et y obéir. Chaque jour, apprenons à persévérer, même quand ce n''est pas évident, en nous souvenant que Dieu est à nos côtés. Restons dans une attitude de gratitude et adorons-le, car Il est au-dessus de tout.',
    'translation_status', 'source'
  )));

end $$;
