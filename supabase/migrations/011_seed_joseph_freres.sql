-- supabase/migrations/011_seed_joseph_freres.sql
-- Seed: L'histoire de Joseph et ses frères — Culte Familial parcours
-- Source: https://minilek.com/lhistoire-de-joseph-et-ses-freres-minilek/
-- Référence : Genèse (résumé narratif)

insert into parcours (slug, translations, image_url, youtube_url, audio_urls, tags, difficulty, tier, published)
values (
  'joseph-et-ses-freres',
  jsonb_build_object('fr', jsonb_build_object(
    'title', 'L''histoire de Joseph et ses frères',
    'story_text', 'Jacob habite dans le pays de Canaan. Il a 12 fils, et Joseph est le 11ème.
Joseph est le fils préféré de Jacob ! Son père l''aime tellement qu''il lui offre une tunique de plusieurs couleurs !
Voyant comment leur père se comporte avec Joseph, ses frères sont jaloux et commencent à le détester.

Peu de temps après, Joseph fait 2 rêves qui viennent de Dieu — on appelle cela des songes — où il voit toute sa famille se prosterner devant lui. Une fois avec des gerbes de blé, et une autre fois avec des étoiles.

Cette annonce énerve encore plus ses frères.
Quelques jours plus tard, voyant arriver Joseph de loin, ceux-ci complotent pour le faire mourir.
« Jetons-le dans une citerne et faisons croire à notre père qu''une bête sauvage l''a dévoré ! »
Mais les frères changent de plan et vendent Joseph à des marchands qui voyagent vers l''Egypte.

Joseph se retrouve à travailler pour Potiphar, le chef des gardes du pharaon. Potiphar lui fait confiance et le laisse gérer toute sa maison, car il voit combien l''Éternel Dieu est avec lui et le bénit dans tout ce qu''il fait.
Un jour, la femme de Potiphar ment et dit à son mari que Joseph a voulu faire une grosse bêtise ! Furieux, Potiphar le jette en prison. Mais Dieu est toujours avec Joseph, et il devient le surveillant de la prison !

Là, Dieu donne à Joseph la signification des rêves de 2 personnes.
2 années passent, et un matin, Pharaon se lève et demande à tous ses magiciens de lui expliquer son rêve, mais personne n''y parvient.
L''homme à qui Joseph avait révélé son rêve se souvient de lui et en parle au Pharaon !

Vite, on sort Joseph de la prison, on le rase et on lui change ses habits. Le voilà tout propre pour se présenter au pharaon.
Joseph prie Dieu pour connaître ce que le rêve bizarre veut dire… et Dieu le lui permet.
Joseph explique : « Il y aura 7 années d''abondance dans toute l''Egypte où tout poussera en grand nombre. Mais attention, après cela il y aura 7 ans de famine, où rien ne poussera. »

Surpris et émerveillé par les paroles de Joseph, Pharaon lui répond : « Puisque Dieu t''a révélé tout cela, je te nomme comme mon second. Il n''y aura personne d''autre plus important que toi et moi dans le pays. »

Après 7 belles années, plus rien ne pousse…
La famine devient si grande que même des personnes d''autres pays viennent en Egypte acheter du blé.
C''est le cas des frères de Joseph, qui manquent eux aussi de nourriture.

Arrivés devant Joseph, ils se prosternent : « Nous venons de Canaan pour acheter de quoi manger. »
Ils n''ont pas reconnu que la personne qui commande le pays, c''est Joseph, leur frère.
Et… Joseph se souvient du songe qu''il avait fait ! Tu sais, celui où les gerbes de blé se prosternaient devant lui ! Ça y est, le message de Dieu vient de s''accomplir !

Mais Joseph choisit de faire semblant de ne pas les reconnaître et il les embête un peu :
« Vous êtes des espions, vous venez ici pour observer les points faibles du pays ! »
Les frères essayent de se défendre, mais pour prouver leur innocence, Joseph leur demande de revenir avec Benjamin.

C''est ce qu''ils font. Les voilà qu''ils reviennent avec Benjamin et se prosternent à nouveau devant Joseph.
Joseph voit son frère Benjamin — il lui avait tellement manqué !
Trop ému, Joseph fait sortir tous les serviteurs de la pièce et dit à ses frères :
« C''est moi Joseph, votre frère que vous avez vendu ! Mais ne vous inquiétez pas, Dieu m''a envoyé ici pour vous sauver la vie ! Allez vite chercher notre père et toute la famille, et venez habiter en Egypte, dans la région de Goshen, car Dieu m''a averti que la famine durera encore 5 ans ! »

Quelle joie et quel soulagement — les 12 frères sont enfin réunis !
Pharaon entend la bonne nouvelle et les invite à venir habiter parmi eux en Egypte.
À leurs retrouvailles, Joseph et son père se prennent dans les bras et pleurent longuement de joie.
C''est ainsi que toute la famille de Joseph s''installe en Égypte.',
    'prayer_text', 'L''histoire de Joseph est dure et triste, mais elle se termine bien — merci Seigneur !

Prenons ce temps pour prier pour l''unité dans notre famille.
Prions pour l''amour dans la fratrie mais aussi pour la relation parents-enfants.
Prions pour la protection de Dieu sur nos enfants et sur notre famille.
Prions aussi pour garder notre cœur accroché à Dieu, comme Joseph.
Prions pour des amis ou familles qui vivent des temps difficiles et où des conflits règnent, afin que Dieu agisse dans les vies et que la paix et la lumière de Dieu demeurent à nouveau dans les foyers.',
    'translation_status', 'source'
  )),
  'https://minilek.com/wp-content/uploads/2025/04/culte-familial-ludique-joseph-et-ses-freres-minilek-min.png',
  'https://www.youtube.com/watch?v=1VgWlKevMUw',
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
  array['Joseph', 'frères', 'Genèse', 'pardon', 'jalousie', 'famine', 'Egypte', 'songes', 'tunique'],
  'debutant',
  'free',
  true
);

do $$
declare p_id uuid;
begin
  select id into p_id from parcours where slug = 'joseph-et-ses-freres';

  -- =====================
  -- QUESTIONS FACILES (4)
  -- order_index 0-3
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  -- Facile 0
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment s''appelle le personnage principal de cette histoire ?',
    'choices', array['Benjamin', 'Joseph', 'Jacob', 'Potiphar'],
    'correct_index', 1,
    'explanation', 'Le personnage principal est Joseph, le 11ème fils de Jacob. C''est son histoire extraordinaire que Dieu a utilisée pour sauver toute sa famille !',
    'translation_status', 'source'
  ))),

  -- Facile 1
  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien de fils a Jacob ?',
    'choices', array['7 fils', '10 fils', '12 fils', '15 fils'],
    'correct_index', 2,
    'explanation', 'Jacob a 12 fils ! Ces 12 fils formeront plus tard les 12 tribus d''Israël. Joseph est le 11ème.',
    'translation_status', 'source'
  ))),

  -- Facile 2
  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Dans quel pays Joseph va-t-il vivre après avoir été vendu ?',
    'choices', array['En Canaan', 'En Egypte', 'En Babylone', 'En Perse'],
    'correct_index', 1,
    'explanation', 'Joseph est vendu à des marchands qui voyagent vers l''Egypte. C''est là que Dieu va faire de lui un homme très important !',
    'translation_status', 'source'
  ))),

  -- Facile 3
  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Joseph va-t-il aider ses frères et leur donner à manger ?',
    'choices', array[
      'Non, il se venge d''eux',
      'Non, il les renvoie en Canaan sans rien',
      'Oui, il les aide et les sauve de la famine',
      'Oui, mais seulement son frère Benjamin'
    ],
    'correct_index', 2,
    'explanation', 'Oui ! Joseph pardonne à ses frères et leur donne à manger. Il les sauve même de la famine et fait venir toute la famille en Egypte !',
    'translation_status', 'source'
  ))),

  -- =====================
  -- QUESTIONS MOYENNES (4)
  -- order_index 4-7
  -- =====================

  -- Moyenne 4
  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment s''appelle le chef des gardes du pharaon chez qui travaille Joseph ?',
    'choices', array['Benjamin', 'Pharaon', 'Potiphar', 'Siméon'],
    'correct_index', 2,
    'explanation', 'Il s''appelle Potiphar. Il fait tellement confiance à Joseph qu''il lui laisse gérer toute sa maison, car il voit que Dieu est avec Joseph.',
    'translation_status', 'source'
  ))),

  -- Moyenne 5
  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien d''années environ Joseph reste-t-il en prison ?',
    'choices', array['6 mois', '1 an', 'Au moins 2 ans', '7 ans'],
    'correct_index', 2,
    'explanation', 'Joseph reste en prison au moins 2 ans ! L''histoire nous dit que 2 années passent avant que Pharaon ne fasse un rêve et qu''on se souvienne de Joseph.',
    'translation_status', 'source'
  ))),

  -- Moyenne 6
  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelle est l''explication des songes du pharaon ?',
    'choices', array[
      '7 ans de guerre, puis 7 ans de paix',
      '7 ans de famine, puis 7 ans d''abondance',
      '7 ans d''abondance, puis 7 ans de famine',
      '14 ans de pluie sans arrêt'
    ],
    'correct_index', 2,
    'explanation', 'Il y aura 7 années d''abondance dans toute l''Egypte où tout poussera en grand nombre. Mais après cela, il y aura 7 ans de famine où plus rien ne poussera. Grâce à cette révélation, Joseph peut préparer l''Egypte à l''avance !',
    'translation_status', 'source'
  ))),

  -- Moyenne 7
  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelle est la réaction de Joseph quand ses frères arrivent en Egypte ?',
    'choices', array[
      'Il pleure et les serre dans ses bras immédiatement',
      'Il les fait emprisonner définitivement',
      'Il fait semblant de ne pas les connaître et les accuse d''être des espions',
      'Il leur offre du blé sans rien dire'
    ],
    'correct_index', 2,
    'explanation', 'Joseph fait semblant de ne pas les reconnaître et les accuse d''être des espions ! Il les embête un peu avant de finalement se révéler à eux, tout en les pardonnant.',
    'translation_status', 'source'
  ))),

  -- ========================
  -- QUESTIONS IMPOSSIBLES (4)
  -- order_index 8-11
  -- ========================

  -- Impossible 8
  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Joseph choisit-il de pardonner ses frères au lieu de se venger ?',
    'choices', array[
      'Parce qu''il a peur d''eux',
      'Parce que Pharaon le lui a ordonné',
      'Parce qu''il sait que Dieu l''a placé en Egypte pour sauver toute sa famille',
      'Parce qu''il les a oubliés avec le temps'
    ],
    'correct_index', 2,
    'explanation', 'Même s''il a vécu des choses difficiles en Egypte, tout seul, Joseph choisit de pardonner ses frères car il sait que Dieu l''a placé là pour sauver toute sa famille ! Il reconnaît le plan de Dieu derrière tout ce qu''il a traversé.',
    'translation_status', 'source'
  ))),

  -- Impossible 9
  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Jacob avait un enfant préféré. Penses-tu que c''est une bonne idée ?',
    'choices', array[
      'Oui, c''est normal d''avoir un favori dans la famille',
      'Oui, cela motive les autres enfants à faire mieux',
      'Non, cela crée de l''injustice, de la jalousie et de la colère',
      'Oui, si le favori est vraiment le plus méritant'
    ],
    'correct_index', 2,
    'explanation', 'Non ! Le favoritisme de Jacob a créé une injustice, de la jalousie et de la colère chez ses frères. Joseph, lui, a dû ressentir de la tristesse d''être rejeté par ses frères à cause de cela. Chaque enfant est précieux et mérite un amour égal !',
    'translation_status', 'source'
  ))),

  -- Impossible 10
  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Les frères de Joseph l''ont abandonné. Est-ce que Dieu aussi l''a abandonné ?',
    'choices', array[
      'Oui, Dieu l''a puni pour ses rêves trop orgueilleux',
      'Oui, Dieu était absent pendant toutes ses épreuves',
      'Non, Dieu était toujours présent — il le bénissait et le protégeait à chaque étape',
      'On ne sait pas, la Bible ne le dit pas clairement'
    ],
    'correct_index', 2,
    'explanation', 'Non, Dieu n''a pas abandonné Joseph ! À chaque instant de sa vie — chez Potiphar, en prison, devant Pharaon — Dieu était là. Il veillait sur lui, le bénissait et bénissait les personnes autour de lui. Dieu l''a finalement placé à un poste élevé pour sauver sa famille.',
    'translation_status', 'source'
  ))),

  -- Impossible 11
  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''apprend l''histoire de Joseph pour notre vie personnelle ?',
    'choices', array[
      'Qu''il faut toujours fuir les problèmes pour s''en sortir',
      'Que Dieu punit ceux qui nous font du mal',
      'Que Dieu est toujours là, a un plan parfait, et peut transformer nos tristesses en joie',
      'Qu''il vaut mieux ne pas avoir de grands rêves pour éviter la jalousie'
    ],
    'correct_index', 2,
    'explanation', 'Dieu est toujours là, dans les bons et les moins bons moments. Il veille sur nous, nous protège et nous encourage. Il a un plan parfait pour notre vie et nous veut du bien. Parfois nous ne comprenons pas tout ce qui arrive, mais Dieu transforme nos tristesses en joie ! Aussi, il faut éviter le favoritisme avec nos frères et sœurs, car chacun est précieux !',
    'translation_status', 'source'
  ))),

  -- =======================
  -- QUESTIONS PARENTS (4)
  -- order_index 12-15
  -- =======================

  -- Parents 12
  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelles sont les conséquences du favoritisme ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Les gestes et attentions portés vers Joseph par son père ont entraîné de la colère dans le cœur des frères de Joseph. Cette colère s''est transformée en haine et par l''envie de commettre un meurtre. Finalement, ils ont abandonné et vendu leur frère comme esclave, menti à leur père en disant qu''il avait été dévoré par une bête sauvage — créant une tristesse immense dans le cœur de Jacob. Toute la famille a été détruite pendant des années.',
    'translation_status', 'source'
  ))),

  -- Parents 13
  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que nous apprend Joseph dans cette histoire ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Il nous apprend à faire confiance à Dieu malgré tout. Il nous apprend à rester gentil, serviable, droit, et à respecter ses valeurs et ses croyances. En faisant tout cela, Dieu le bénit abondamment. Joseph est l''exemple que la vie peut être difficile, mais que Dieu est capable de tout changer et de faire revenir l''amour, la paix et la joie !',
    'translation_status', 'source'
  ))),

  -- Parents 14
  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel était le plan de Dieu dans toute cette histoire ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Sauver la famille de Joseph de la famine. Dieu a utilisé même les mauvaises actions des frères pour accomplir quelque chose de grand. Là où les hommes ont voulu faire du mal, Dieu a su en faire sortir un bien immense pour toute une famille.',
    'translation_status', 'source'
  ))),

  -- Parents 15
  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pardonner, est-ce une bonne idée si je vis la même chose que Joseph ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Oui, pardonner te libère ! Pardonner ne veut pas dire effacer les mauvaises choses ni accepter les mauvaises paroles ou actions reçues. Pardonner, c''est accepter de laisser Dieu guérir notre cœur et ses blessures. Pardonner, c''est laisser Dieu nous faire avancer vers une vie meilleure. Pardonner, c''est laisser Dieu faire justice.',
    'translation_status', 'source'
  )));

end $$;
