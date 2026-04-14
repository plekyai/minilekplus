-- supabase/migrations/005_seed_peche_miraculeuse.sql
-- Seed: La pêche miraculeuse — 2nd Culte Familial parcours
-- Source: https://minilek.com/la-peche-miraculeuse / Luc 5:1-11

insert into parcours (
  slug,
  translations,
  image_url,
  youtube_url,
  audio_urls,
  tags,
  difficulty,
  tier,
  published
) values (
  'la-peche-miraculeuse',
  jsonb_build_object(
    'fr', jsonb_build_object(
      'title', 'La pêche miraculeuse',
      'story_text', 'Un matin, au bord du lac de Tibériades, des pêcheurs lavent leurs filets. Jésus demande à Simon, l''un d''eux de monter à bord de sa barque car une foule est venue l''écouter.

Jésus parle à la foule, puis quand il a terminé, il s''adresse à Simon :

"Simon, va plus au large et jette tes filets à l''eau".

Fatigué, Simon répond : "Maître, nous avons pêché toute la nuit sans rien prendre… Mais sur ta parole, je jetterai le filet."

Arrivé en eau profonde, Simon jette le filet. C''est alors que le filet se remplit de poissons. Il y a en a tellement que son filet se casse presque.

Vite, il appelle ses amis pour qu''ils viennent l''aider. Puis ils ramènent tout le butin au rivage.

Simon est tellement effrayé et à la fois émerveillé par ce qu''il vient de se passer, qu''il se met à genoux devant Jésus.

Jésus lui dit : « Simon, à partir d''aujourd''hui, suis-moi et je te ferai pêcheur d''hommes. Tu deviendras mon disciple et tu parleras à tous de moi ! »

A cet instant même, Simon se met à suivre Jésus.',
      'prayer_text', 'Cette histoire nous retrace le moment où Jésus a fait un miracle auprès de Simon puis l''a appelé à le suivre et à devenir son disciple.

Prions en famille pour que Dieu se révèle afin que les membres de notre famille fasse le même choix que Simon : suivre Jésus.

Remercions Dieu de vouloir vivre en nous pour nous guider et nous aider à devenir des disciples de Jésus.',
      'translation_status', 'source'
    )
  ),
  'https://minilek.com/wp-content/uploads/2025/01/culte-familial-ludique-minilek-la-peche-miraculeuse-min-1024x574.png',
  'https://www.youtube.com/watch?v=FA9oCYN_2sA',
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
  array['miracle', 'Simon Pierre', 'vocation', 'disciple', 'Jésus'],
  'debutant',
  'free',
  true
);

-- Questions
do $$
declare
  p_id uuid;
begin
  select id into p_id from parcours where slug = 'la-peche-miraculeuse';

  -- =====================
  -- QUESTIONS FACILES (4)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment s''appelle le pêcheur sur son bateau ?',
    'choices', array['Jean', 'Simon', 'Jacques', 'André'],
    'correct_index', 1,
    'explanation', 'Il s''appelle Simon — il sera appelé Pierre plus tard.',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que fait Simon sur son bateau quand Jésus vient le voir ?',
    'choices', array['Il pêche du poisson', 'Il dort dans la barque', 'Il lave ses filets', 'Il répare son bateau'],
    'correct_index', 2,
    'explanation', 'Simon lave ses filets après une longue nuit de pêche.',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Où se trouve Jésus au début de l''histoire ?',
    'choices', array['Au bord du Jourdain', 'Dans le désert', 'Sur une montagne', 'Au bord du lac de Tibériades'],
    'correct_index', 3,
    'explanation', 'Jésus est au bord du lac de Tibériades, aussi appelé mer de Galilée.',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que s''est-il passé quand Simon a jeté son filet sur la parole de Jésus ?',
    'choices', array['Il n''a rien pêché', 'Il a pêché quelques poissons', 'Il a trouvé un trésor', 'Son filet s''est rempli de tant de poissons qu''il faillit se casser'],
    'correct_index', 3,
    'explanation', 'En obéissant à Jésus, Simon a pêché tellement de poissons que son filet a failli se casser !',
    'translation_status', 'source'
  )));

  -- ========================
  -- QUESTIONS MOYENNES (4)
  -- ========================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qui monte sur le bateau de Simon ?',
    'choices', array['Pierre', 'Jésus', 'Jean et Jacques', 'Une grande foule'],
    'correct_index', 1,
    'explanation', 'C''est Jésus qui monte dans la barque de Simon pour parler à la foule.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Simon n''est-il pas enchanté de repartir en mer ?',
    'choices', array['Il a peur des vagues', 'Il veut rentrer chez lui', 'Il a pêché toute la nuit sans rien prendre', 'Son filet est cassé'],
    'correct_index', 2,
    'explanation', 'Simon a passé toute la nuit à pêcher sans rien prendre — il est fatigué !',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment réagit Simon quand le miracle se produit ?',
    'choices', array['Il crie de joie', 'Il ignore Jésus', 'Il se prosterne devant Jésus, effrayé et émerveillé', 'Il distribue les poissons à la foule'],
    'correct_index', 2,
    'explanation', 'Simon est tellement effrayé et émerveillé qu''il se met à genoux devant Jésus.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que fait Simon quand Jésus lui dit "Suis-moi" ?',
    'choices', array['Il hésite longtemps', 'Il refuse poliment', 'Il demande à réfléchir', 'Il se met à le suivre immédiatement'],
    'correct_index', 3,
    'explanation', 'Simon se lève et suit Jésus immédiatement, sans hésiter.',
    'translation_status', 'source'
  )));

  -- ==========================
  -- QUESTIONS IMPOSSIBLES (4)
  -- ==========================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que dit Jésus à Simon ?',
    'choices', array['Suis-moi et je te ferai pêcheur d''hommes', 'Vends tout ce que tu as', 'Va et ne pèche plus', 'Donne ton poisson aux pauvres'],
    'correct_index', 0,
    'explanation', 'Jésus lui dit : « Suis-moi et je te ferai pêcheur d''hommes. » Il avait déjà un plan pour Simon !',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que veut dire "être pêcheur d''hommes" ?',
    'choices', array['Capturer des gens', 'Pêcher pour nourrir les hommes', 'Parler de Jésus pour que d''autres deviennent chrétiens', 'Devenir un grand chef militaire'],
    'correct_index', 2,
    'explanation', 'Être pêcheur d''hommes, c''est parler de Dieu et de la Bonne Nouvelle de Jésus à beaucoup de monde, afin qu''eux aussi deviennent chrétiens.',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Est-ce que Simon a continué son métier de pêcheur après avoir rencontré Jésus ?',
    'choices', array['Oui, il a continué à pêcher', 'Oui, mais seulement le week-end', 'Non, il a suivi Jésus et est devenu son disciple', 'On ne sait pas du tout'],
    'correct_index', 2,
    'explanation', 'Non, Simon a tout quitté pour suivre Jésus et devenir l''un de ses disciples les plus proches.',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que s''est-il passé de tout le poisson pêché ?',
    'choices', array['Simon l''a vendu au marché', 'Jésus l''a multiplié pour la foule', 'Simon l''a ramené chez lui', 'On ne sait pas — peut-être ses amis ou la foule l''ont récupéré'],
    'correct_index', 3,
    'explanation', 'On ne le sait pas ! L''important dans cette histoire, c''est Simon qui répond à l''appel de Jésus, pas les poissons !',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS PARENTS (4)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values

  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Jésus a-t-il appelé Simon à le suivre ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Jésus voulait que Simon devienne son disciple. En lui disant « je te ferai pêcheur d''hommes », on comprend que Jésus avait déjà planifié une belle mission pour lui.',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Penses-tu que Jésus a appelé seulement Simon à le suivre ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Non ! Jésus a appelé bien d''autres personnes notées dans la Bible. Mais surtout, Jésus nous appelle tous à le suivre comme ses disciples !',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que signifie "suivre Jésus" pour toi et ta famille aujourd''hui ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Suivre Jésus, c''est, au travers de la Bible, apprendre à le connaître, l''aimer, devenir un disciple en faisant ce qui lui plaît et en parlant de Lui autour de nous.',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce qu''un disciple de Jésus ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Un disciple est une personne qui se forme auprès d''un maître. Peu à peu, il devient comme son maître. Être disciple de Jésus, c''est devenir peu à peu comme Jésus.',
    'translation_status', 'source'
  )));

end $$;
