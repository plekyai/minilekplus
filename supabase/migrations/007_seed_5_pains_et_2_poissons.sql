-- supabase/migrations/007_seed_5_pains_et_2_poissons.sql
-- Seed: L'histoire des 5 pains et 2 poissons — Culte Familial parcours
-- Source: https://minilek.com/lhistoire-des-5-pains-et-2-poissons / Matthieu 14:13-21

insert into parcours (slug, translations, image_url, youtube_url, audio_urls, tags, difficulty, tier, published)
values (
  '5-pains-et-2-poissons',
  jsonb_build_object('fr', jsonb_build_object(
    'title', 'L''histoire des 5 pains et 2 poissons',
    'story_text', 'Matthieu 14 : 13-21

Un jour, Jésus traverse en bateau un lac pour être un peu tranquille, mais lorsqu''il arrive sur le rivage, une foule de gens l''attend ! Ils ont envie de l''entendre parler et d''être guéri par lui.

Alors Jésus, rempli d''amour pour eux guérit les malades… Mais le temps passe et le soir vient. Les disciples de Jésus lui demandent : "Jésus, il commence à se faire tard et ses personnes viennent de loin. Dis leur d''aller dans les villes pour se nourrir."

Mais Jésus leur répond : "ils n''ont pas besoin de partir, donnez-leur vous-même à manger !"

Les disciples se regardent tout surpris : "euh, nous n''avons que cinq pains et deux poissons qu''un jeune garçon nous a donnés".

Jésus demande alors à faire asseoir la foule… Il y avait plus de 5000 personnes. C''est une grande foule pour si peu de nourriture… Mais rien n''est impossible à Dieu !

Jésus prend les pains et les poissons dans ses mains, prie Dieu et le remercie pour le repas.

Puis, il distribue les morceaux à ses disciples pour qu''ils nourrissent la foule.

A ce moment-là quelque chose d''incroyable se passe, les disciples distribue les pains et poissons mais il y en a toujours ! Les gens peuvent même se servir à nouveau. Tout le monde mange à sa fin… Et une fois que la foule a été rassasiée, il reste encore 12 paniers pleins de pains et de poissons !',
    'prayer_text', 'Cette histoire nous montre que Jésus voit nos besoins et qu''il prend soin de nous. Avec seulement 5 pains et 2 poissons, il a nourri plus de 5000 personnes — rien n''est impossible à Dieu !

Remercions Dieu ensemble en famille pour sa générosité et pour tout ce qu''il nous donne chaque jour.

Prions en famille pour que notre foi grandisse, comme Jésus qui a remercié Dieu avant même de voir le miracle se produire. Demandons à Dieu de pourvoir à nos besoins et à ceux des personnes autour de nous, en croyant sans douter qu''il peut agir dans notre situation.',
    'translation_status', 'source'
  )),
  'https://minilek.com/wp-content/uploads/2025/04/culte-familial-ludique-Jesus-nourrit-5000-personnes-avec-5-pains-et-2-poissons-Miracles-de-Jesus-minilek-min.png',
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
  array['miracle', 'multiplication', '5 pains', '2 poissons', 'Jésus', 'foi', 'partage'],
  'debutant',
  'free',
  true
);

do $$
declare p_id uuid;
begin
  select id into p_id from parcours where slug = '5-pains-et-2-poissons';

  -- =====================
  -- QUESTIONS FACILES (4)
  -- order_index 0-3
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel miracle fait Jésus ?',
    'choices', array['Il marche sur l''eau', 'Il multiplie la nourriture', 'Il guérit un aveugle', 'Il ressuscite un mort'],
    'correct_index', 1,
    'explanation', 'Il multiplie la nourriture. Il donne à manger à tout le monde avec seulement 5 pains et 2 poissons.',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Est-ce que tout le monde a eu assez à manger ?',
    'choices', array['Non, il n''y avait pas assez pour tout le monde', 'Oui, ils ont été rassasiés', 'Seulement les enfants ont mangé', 'Seulement les disciples ont mangé'],
    'correct_index', 1,
    'explanation', 'Oui, ils ont été rassasiés. Tout le monde a pu manger à sa faim !',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Y avait-il des restes après le repas ?',
    'choices', array['Non, tout avait été mangé', 'Oui, il restait 3 paniers', 'Oui, il restait 12 paniers pleins', 'Oui, il restait 7 paniers'],
    'correct_index', 2,
    'explanation', 'Oui, il est resté 12 paniers pleins de pains et de poissons !',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce que la foule a mangé ?',
    'choices', array['Des fruits et des légumes', 'De la viande et du vin', 'Du pain et du poisson', 'Des figues et du miel'],
    'correct_index', 2,
    'explanation', 'La foule a mangé du pain et du poisson.',
    'translation_status', 'source'
  )));

  -- ========================
  -- QUESTIONS MOYENNES (4)
  -- order_index 4-7
  -- ========================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien y avait-il de pains et de poissons au début ?',
    'choices', array['3 pains et 5 poissons', '7 pains et 3 poissons', '5 pains et 2 poissons', '2 pains et 5 poissons'],
    'correct_index', 2,
    'explanation', 'Il y avait 5 pains et 2 poissons — apportés par un jeune garçon.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Après le repas, combien y avait-il de paniers de restes ?',
    'choices', array['5', '7', '10', '12'],
    'correct_index', 3,
    'explanation', '12 ! Il restait 12 paniers pleins de restes après que tout le monde eut mangé à sa faim.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''a fait Jésus avant de distribuer la nourriture ?',
    'choices', array['Il a demandé à la foule de donner de l''argent', 'Il a prié Dieu et remercié pour la nourriture', 'Il a demandé aux disciples d''aller acheter du pain', 'Il a envoyé la foule dans les villages'],
    'correct_index', 1,
    'explanation', 'Il a prié Dieu et remercié pour la nourriture — un acte de foi avant le miracle.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Jésus a-t-il nourri la foule ?',
    'choices', array['Parce que les disciples avaient faim', 'Parce qu''il voulait montrer un miracle', 'Parce qu''il se faisait tard et les gens étaient venus de loin', 'Parce que le roi lui avait demandé'],
    'correct_index', 2,
    'explanation', 'Il se faisait tard et les gens étaient venus de loin pour écouter Jésus. Il ne voulait pas les renvoyer sans manger.',
    'translation_status', 'source'
  )));

  -- ==========================
  -- QUESTIONS IMPOSSIBLES (4)
  -- order_index 8-11
  -- ==========================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'D''où venaient les pains et les poissons ?',
    'choices', array['Les disciples les avaient achetés au marché', 'Un garçon les avait donnés aux disciples', 'Ils sont apparus miraculeusement dans les mains de Jésus', 'La foule avait apporté de la nourriture'],
    'correct_index', 1,
    'explanation', 'Un garçon les avait donnés aux disciples. C''est ce petit geste généreux que Jésus a utilisé pour nourrir plus de 5000 personnes !',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Peut-il encore y avoir des miracles comme ça aujourd''hui ?',
    'choices', array['Non, les miracles n''existaient qu''à l''époque de Jésus', 'Oui, Dieu ne change pas et peut faire des miracles aujourd''hui', 'Seulement si on est dans une église', 'On ne peut pas savoir'],
    'correct_index', 1,
    'explanation', 'Oui, il peut encore y en avoir aujourd''hui. Dieu ne change pas, il a fait des miracles, il en fait aujourd''hui et en fera encore.',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce que cette histoire t''apprend sur Dieu pour ta vie ?',
    'choices', array['Que Dieu ne s''intéresse qu''aux grandes foules', 'Que Dieu voit mes besoins et prend soin de moi', 'Que Dieu ne fait des miracles que si on a beaucoup de foi', 'Que Dieu préfère les gens qui prient souvent'],
    'correct_index', 1,
    'explanation', 'Cette histoire nous apprend que Dieu voit nos besoins et il prend soin de nous et des gens.',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi peut-on dire que Jésus avait la foi ?',
    'choices', array['Parce qu''il a marché sur l''eau', 'Parce qu''il a prié fort', 'Parce qu''il a remercié Dieu pour la nourriture avant le miracle', 'Parce qu''il a jeûné 40 jours'],
    'correct_index', 2,
    'explanation', 'Jésus a remercié Dieu pour la nourriture. Il croyait et savait que Dieu allait pourvoir en pains et poissons pour tout ce monde.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS PARENTS (4)
  -- order_index 12-15
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Sommes-nous obligés de remercier Dieu avant de manger ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Il n''y a pas d''obligation à cela. Ici, Jésus l''a fait et c''était un acte de foi de remercier Dieu. De notre côté, cela peut être également un bon sujet de gratitude, car Dieu nous permet d''avoir un bon plat – et cela n''est pas toujours le cas pour tout le monde sur terre.',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'En arrivant sur le rivage, quelle est la réaction de Jésus en voyant la foule ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Jésus est rempli d''amour pour eux. Il veut les bénir, les aider, les guérir… Et les nourrir. Jésus désire que chacun de nous soit en bonne santé et ne manque de rien. Il nous aime tellement !',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment Dieu pourvoit-il à nos besoins ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Lorsque nous mettons notre foi en Dieu et demandons quelque chose, Dieu nous bénit même au-delà de ce que nous pouvons imaginer ! Ici, les disciples étaient septiques de ces quelques aliments, et jamais ils n''auraient imaginé qu''il en resterait 12 paniers !',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que faire si tu as un besoin comme cette foule ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Tu peux parler à Dieu (prier), lui dire ce dont tu as besoin. Remercie-le de prendre soin de toi. N''oublie pas qu''Il t''aime ! Et surtout prie avec foi – c''est à dire, crois sans douter que Dieu peut agir dans ta situation.',
    'translation_status', 'source'
  )));

end $$;
