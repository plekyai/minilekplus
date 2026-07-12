-- supabase/migrations/010_seed_maison_roc_sable.sql
-- Seed: L'histoire de la maison sur le roc et la maison sur le sable — Culte Familial parcours
-- Source: https://minilek.com/lhistoire-de-la-maison-sur-le-roc-et-la-maison-sur-le-sable-minilek/
-- Référence : Matthieu 7 : 24-29

insert into parcours (slug, translations, image_url, youtube_url, audio_urls, tags, difficulty, tier, published)
values (
  'maison-sur-le-roc',
  jsonb_build_object('fr', jsonb_build_object(
    'title', 'L''histoire de la maison sur le roc et la maison sur le sable',
    'story_text', 'Matthieu 7 : 24-29

Jésus explique aux gens qui l''entourent :

« Celui qui écoute mes paroles et qui y obéit est comme un homme prudent qui a construit sa maison sur un rocher.

La pluie est tombée, les vents ont soufflé, les torrents sont venus et se sont jetés contre la maison.
Mais elle ne s''est pas cassée, car elle était construite sur un roc bien solide.

Par contre, celui qui écoute mes paroles, et qui n''y obéit pas, est comme un homme fou qui a bâti sa maison sur du sable.

La pluie est tombée, les torrents sont venus, les vents ont soufflé et la maison s''est complètement écroulée ! »',
    'prayer_text', 'Cette parabole est une belle image de la vie.

Prions en famille pour que chacun des membres de la famille puisse faire le bon choix.
Construire sa maison sur le roc n''est pas toujours évident mais Dieu veille et nous aide.
Si l''un des membres a choisi le sable comme fondation, prions afin que Dieu touche son cœur à nouveau afin que lorsque la tempête arrivera, il fasse confiance au Dieu tout-puissant !',
    'translation_status', 'source'
  )),
  'https://minilek.com/wp-content/uploads/2025/04/culte-familial-ludique-maison-sur-le-roc-maison-sur-le-sable-minilek-min.png',
  'https://www.youtube.com/watch?v=pOuelpgnzm0',
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
  array['maison', 'roc', 'sable', 'parabole', 'Matthieu', 'obéissance', 'fondation', 'Jésus'],
  'debutant',
  'free',
  true
);

do $$
declare p_id uuid;
begin
  select id into p_id from parcours where slug = 'maison-sur-le-roc';

  -- =====================
  -- QUESTIONS FACILES (4)
  -- order_index 0-3
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  -- Facile 0
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien y a-t-il de maisons différentes dans l''histoire de Jésus ?',
    'choices', array[
      '1 maison',
      '2 maisons',
      '3 maisons',
      '4 maisons'
    ],
    'correct_index', 1,
    'explanation', 'Dans la parabole, Jésus parle de 2 maisons : une construite sur le roc et une autre construite sur le sable.',
    'translation_status', 'source'
  ))),

  -- Facile 1
  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'La pluie tombe-t-elle sur les deux maisons ?',
    'choices', array[
      'Non, seulement sur la maison sur le sable',
      'Non, seulement sur la maison sur le roc',
      'Oui, la pluie tombe sur les deux maisons',
      'On ne sait pas, l''histoire ne le dit pas'
    ],
    'correct_index', 2,
    'explanation', 'Oui ! La pluie, les vents et les torrents s''abattent sur les deux maisons. La différence, c''est leur fondation : le roc ou le sable.',
    'translation_status', 'source'
  ))),

  -- Facile 2
  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Les deux maisons restent intactes malgré la tempête, vrai ou faux ?',
    'choices', array[
      'Vrai, les deux maisons résistent',
      'Faux, l''une d''elle se détruit',
      'Vrai, mais elles sont un peu abîmées',
      'Faux, les deux maisons s''effondrent'
    ],
    'correct_index', 1,
    'explanation', 'Faux ! La maison construite sur le roc tient bon, mais la maison construite sur le sable s''est complètement écroulée.',
    'translation_status', 'source'
  ))),

  -- Facile 3
  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', '3 éléments sont venus sur les maisons : la pluie, le vent et… ?',
    'choices', array[
      'Les éclairs',
      'Les torrents',
      'La grêle',
      'La neige'
    ],
    'correct_index', 1,
    'explanation', 'Les 3 éléments qui s''abattent sur les maisons sont : la pluie, les vents et les torrents !',
    'translation_status', 'source'
  ))),

  -- =====================
  -- QUESTIONS MOYENNES (4)
  -- order_index 4-7
  -- =====================

  -- Moyenne 4
  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Celui qui écoute et obéit aux paroles de Jésus est comme un homme qui construit sa maison sur… ?',
    'choices', array[
      'Le sable',
      'Le roc',
      'L''eau',
      'La terre'
    ],
    'correct_index', 1,
    'explanation', 'Celui qui écoute et obéit aux paroles de Jésus est comme un homme sage qui construit sa maison sur le roc — une fondation solide qui résiste à toutes les tempêtes.',
    'translation_status', 'source'
  ))),

  -- Moyenne 5
  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'En racontant cette parabole, Jésus souhaite que nous construisions notre vie sur le roc ou sur le sable ?',
    'choices', array[
      'Sur le sable, pour être plus flexibles',
      'Sur le roc, car Jésus est notre fondation solide',
      'Peu importe, les deux sont bien',
      'Sur l''eau, pour rester libres'
    ],
    'correct_index', 1,
    'explanation', 'Jésus veut que notre vie soit construite sur le roc — c''est-à-dire sur ses paroles et sur lui-même. La maison de l''histoire représente notre vie.',
    'translation_status', 'source'
  ))),

  -- Moyenne 6
  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi la maison sur le sable se détruit-elle avec la tempête ?',
    'choices', array[
      'Parce qu''elle est trop petite',
      'Parce qu''elle est faite en bois',
      'Parce que le sable n''est pas une fondation solide',
      'Parce qu''elle est trop loin de la ville'
    ],
    'correct_index', 2,
    'explanation', 'Le sable n''est pas une fondation solide. Avec un peu d''eau, un tas de sable s''écroule facilement. La maison construite dessus ne peut donc pas tenir.',
    'translation_status', 'source'
  ))),

  -- Moyenne 7
  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'À qui correspond le roc (le rocher solide) dont parle l''histoire ?',
    'choices', array[
      'À la maison elle-même',
      'Aux parents de la famille',
      'À la Bible uniquement',
      'À Jésus'
    ],
    'correct_index', 3,
    'explanation', 'Le roc, c''est Jésus ! S''appuyer sur ses paroles et lui obéir, c''est bâtir sa vie sur une fondation qui ne bougera jamais.',
    'translation_status', 'source'
  ))),

  -- ========================
  -- QUESTIONS IMPOSSIBLES (4)
  -- order_index 8-11
  -- ========================

  -- Impossible 8
  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Jésus conseille-t-il d''écouter et d''obéir à ses paroles ?',
    'choices', array[
      'Pour montrer qu''il est le plus fort',
      'Pour que nous ayons moins de problèmes que les autres',
      'Parce que Dieu est bon et stable — sans Lui, on est perdu quand la tempête arrive',
      'Parce que sinon il nous punit'
    ],
    'correct_index', 2,
    'explanation', 'Dieu ne change pas, il est bon et a un plan de paix pour nous. Si nous l''écoutons et lui obéissons, nous vivons comme sur un roc. Sans Lui (construit sur le sable), nous sommes déboussolés et perdus quand tout va mal.',
    'translation_status', 'source'
  ))),

  -- Impossible 9
  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelle chose de la vie quotidienne peut correspondre à la pluie, au vent ou au torrent ?',
    'choices', array[
      'Les vacances et le repos',
      'Une bonne note à l''école',
      'La maladie, un accident, la peur ou un problème difficile',
      'Un repas en famille'
    ],
    'correct_index', 2,
    'explanation', 'La pluie, le vent et les torrents représentent les épreuves de la vie : la maladie, un accident, un problème de finances, la peur, le harcèlement… Dieu nous aide à traverser ces tempêtes si nous nous appuyons sur Lui.',
    'translation_status', 'source'
  ))),

  -- Impossible 10
  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que signifie "construire sa maison sur le sable" ?',
    'choices', array[
      'Habiter près de la plage',
      'S''appuyer sur la Parole de Dieu chaque jour',
      'Faire sa vie sans se soucier de Dieu, comme si on était plus intelligent que notre Créateur',
      'Prier chaque jour'
    ],
    'correct_index', 2,
    'explanation', 'Construire sa maison sur le sable, c''est faire sa vie comme on en a envie, sans se soucier de Dieu. C''est décider de tout soi-même. C''est penser que nous sommes meilleurs et plus intelligents que Dieu, notre Créateur.',
    'translation_status', 'source'
  ))),

  -- Impossible 11
  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Si nous écoutons Jésus et lui obéissons, vivrons-nous sans aucun problème ?',
    'choices', array[
      'Oui, plus aucun problème jamais',
      'Oui, mais seulement les petits problèmes disparaissent',
      'Non, nous vivons les mêmes épreuves mais Dieu nous protège et nous restons fermes',
      'Non, car suivre Jésus rend la vie plus difficile'
    ],
    'correct_index', 2,
    'explanation', 'Non ! Dans la parabole, la pluie, les vents et les torrents s''abattent sur les DEUX maisons. Mais la différence, c''est que la maison sur le roc reste debout. Nous vivons les mêmes épreuves que tout le monde, mais Dieu nous protège et nous restons fermes.',
    'translation_status', 'source'
  ))),

  -- =======================
  -- QUESTIONS PARENTS (4)
  -- order_index 12-15
  -- =======================

  -- Parents 12
  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelle est la différence entre les deux maisons ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'L''une est construite sur une fondation solide et stable : le roc. Elle passe la tempête et reste sur pieds.
L''autre est construite sur une fondation fragile et instable : le sable. Elle ne survit pas à la tempête et est détruite en mille morceaux.',
    'translation_status', 'source'
  ))),

  -- Parents 13
  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Jésus parle-t-il en paraboles ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Jésus explique parfois des choses compliquées à comprendre. Il utilise des images et des situations concrètes faciles à visualiser pour que tout le monde retienne mieux le message.',
    'translation_status', 'source'
  ))),

  -- Parents 14
  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Jésus nous invite à construire notre maison sur le roc. Qu''est-ce que ça veut dire concrètement pour notre quotidien ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Dieu veut vivre en nous. Au quotidien, cela veut dire prier, lire la Bible, et essayer d''agir et de parler en suivant l''exemple de Jésus : aimer Dieu de tout notre cœur, aimer les autres comme nous-mêmes (être gentil, généreux, pardonner, faiseurs de paix…).

Dieu désire que lorsque nous vivons des choses difficiles, nous puissions venir lui parler, lui demander de l''aide, être consolés et rassurés par lui. Dieu désire agir dans notre vie pour que tout aille pour le mieux, mais cela nous demande de Lui faire confiance !',
    'translation_status', 'source'
  ))),

  -- Parents 15
  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que se passe-t-il si je choisis de construire ma maison sur le sable ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Dieu te laisse le choix, mais cela rend son cœur tout triste, car il t''aime énormément et il te veut du bien ! Dieu ne veut pas que tu sois blessé ou perdu.

Par des histoires comme cette parabole ou par bien d''autres façons, Dieu essayera de te parler, de toucher ton cœur. Il voudra te faire prendre conscience qu''Il est là pour toi, qu''Il t''aidera à tout traverser, mais Il ne te forcera pas. Il a besoin que tu croies en Lui et que tu Lui fasses confiance.',
    'translation_status', 'source'
  )));

end $$;
