-- supabase/migrations/006_seed_reine_esther.sql
insert into parcours (slug, translations, image_url, youtube_url, audio_urls, tags, difficulty, tier, published)
values (
  'la-reine-esther',
  jsonb_build_object('fr', jsonb_build_object(
    'title', 'La reine Esther',
    'story_text', 'Livre d''Esther – Ancien Testament

Esther est une jeune femme qui vit dans un grand royaume avec son oncle Mardochée. Esther aime beaucoup Dieu.

Un jour, le roi du pays cherche une nouvelle reine. Quand il voit Esther, il la trouve si belle qu''il décide d''en faire sa reine. Esther devient donc la nouvelle reine mais elle ne dit pas au roi qu''elle est juive, car son oncle Mardochée lui a demandé de garder cela secret.

Un conseiller du roi, appelé Haman, n''aime pas les Juifs et veut leur faire du mal. Il convainc le roi de faire une loi pour les tuer à une date précise.

Quand Mardochée apprend cela, il demande à Esther d''aider le peuple juif. Esther a peur, car personne n''est autorisé à parler au roi sans être invité, même la reine. Si en entrant dans la salle du trône, le roi tend son sceptre, elle pourra parler librement, mais sinon elle pourrait mourir.

C''est dangereux mais Esther sait que c''est important. Alors, notre belle reine demande aux Juifs de prier Dieu et de jeûner avec elle pendant trois jours. C''est-à-dire que pendant trois jours, ils ne mangent pas, ne boivent pas et ils prient pour demander l''aide de Dieu.

Après ces trois jours, Esther entre dans le palais. Elle a sans doute peur mais elle fait confiance à Dieu pour sa vie et celle de son peuple. Le roi tend son sceptre d''or vers Esther : « Qu''as-tu, reine Esther et que demandes-tu ? Même si c''est la moitié de mon royaume, je te le donnerai ».

Esther invite le roi à un grand repas avec Haman. Mais elle n''ose pas en parler, alors elle demande au roi de revenir le lendemain pour manger de nouveau avec elle et Haman. Lors du repas, Esther révèle au roi à quel point Haman est méchant et comment il veut faire du mal à son peuple.

Le roi comprend que Haman est un homme mauvais. Il se met en colère, punit Haman pour ses mauvaises actions et modifie la loi.

Grâce au courage de la reine Esther, à ses prières et à son amour pour son peuple, les Juifs ont été sauvés.',
    'prayer_text', 'Cette histoire nous montre le courage et la foi d''une jeune femme qui aimait son peuple. Elle a pris du temps à part pour prier son Dieu et jeûner, espérant que Dieu agisse puissamment dans cette situation et sauve le peuple juif.

Invitons notre enfant à remercier Dieu pour la sécurité que nous avons dans notre pays de prier et d''aimer Dieu librement.

Prions en famille, comme Esther avec son peuple, pour les pays où des gens veulent la mort de chrétiens. Prions pour leur protection, pour que le cœur des dirigeants ou méchantes personnes s''adoucissent, ainsi que pour que Dieu leur donne la force et le courage de continuer à avoir la foi.',
    'translation_status', 'source'
  )),
  'https://minilek.com/wp-content/uploads/2025/04/culte-familial-ludique-reine-esther-minilek-min.png',
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
  array['Esther', 'courage', 'jeûne', 'prière', 'Ancien Testament', 'foi', 'peuple juif'],
  'debutant',
  'free',
  true
);

do $$
declare p_id uuid;
begin
  select id into p_id from parcours where slug = 'la-reine-esther';

  insert into questions (parcours_id, type, order_index, translations) values

  -- FACILE (4 questions)
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel est le prénom de la reine dont parle cette histoire ?',
    'choices', array['Ruth', 'Esther', 'Marie', 'Déborah'],
    'correct_index', 1,
    'explanation', 'Elle s''appelle Esther. C''est elle la reine courageuse qui a sauvé son peuple !',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qui s''occupe d''Esther depuis qu''elle est petite ?',
    'choices', array['Haman', 'Le roi', 'Mardochée', 'Son père'],
    'correct_index', 2,
    'explanation', 'C''est Mardochée, son oncle, qui a élevé Esther depuis qu''elle était petite.',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Esther réussit-elle à sauver le peuple juif ?',
    'choices', array['Non, elle échoue', 'Oui, grâce à son courage et sa foi', 'Elle ne sait pas', 'Le roi refuse de l''écouter'],
    'correct_index', 1,
    'explanation', 'Oui ! Grâce au courage de la reine Esther, à ses prières et à son amour pour son peuple, les Juifs ont été sauvés.',
    'translation_status', 'source'
  ))),

  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-il arrivé à Haman à la fin de l''histoire ?',
    'choices', array['Il est devenu ami d''Esther', 'Il est devenu le nouveau roi', 'Le roi l''a puni sévèrement', 'Il s''est enfui du royaume'],
    'correct_index', 2,
    'explanation', 'Le roi a compris qu''Haman était un homme mauvais et l''a puni sévèrement pour ses mauvaises actions.',
    'translation_status', 'source'
  ))),

  -- MOYENNE (4 questions)
  (p_id, 'moyenne', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi le roi a-t-il choisi Esther comme sa nouvelle reine ?',
    'choices', array['Parce qu''elle était très sage', 'Parce qu''elle était très belle', 'Parce qu''elle était très riche', 'Parce que Mardochée le lui avait demandé'],
    'correct_index', 1,
    'explanation', 'Le roi l''a choisie car elle était très belle ! Dieu a utilisé cette beauté pour placer Esther au bon endroit au bon moment.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Esther demande au peuple juif de jeûner avec elle pendant combien de jours ?',
    'choices', array['7 jours', '40 jours', '3 jours', '1 jour'],
    'correct_index', 2,
    'explanation', '3 jours ! Pendant ces trois jours, ils ne mangeaient pas, ne buvaient pas et priaient pour demander l''aide de Dieu.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelle est la réponse d''Esther à la question du roi lorsqu''il lui demande ce qu''elle désire ?',
    'choices', array['Elle lui demande de l''or', 'Elle lui demande de libérer le peuple juif directement', 'Elle l''invite à un repas avec Haman', 'Elle lui révèle immédiatement le complot d''Haman'],
    'correct_index', 2,
    'explanation', 'Elle l''invite à un repas avec Haman. Esther a procédé avec sagesse et patience, invitant le roi deux fois à table avant de révéler le complot.',
    'translation_status', 'source'
  ))),

  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'À quel moment Esther annonce-t-elle au roi le complot d''Haman ?',
    'choices', array['Dès qu''elle entre dans la salle du trône', 'Lors du premier repas avec le roi', 'Lors du second repas avec le roi', 'Avant de jeûner'],
    'correct_index', 2,
    'explanation', 'Esther le fait lors du second repas avec le roi. Elle a attendu le bon moment pour révéler la vérité sur Haman.',
    'translation_status', 'source'
  ))),

  -- IMPOSSIBLE (4 questions)
  (p_id, 'impossible', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelle était la seule solution pour qu''Esther survive en allant parler au roi sans invitation ?',
    'choices', array['Que Mardochée vienne avec elle', 'Que le roi tende son sceptre quand elle entrait dans la salle du trône', 'Qu''elle apporte un cadeau précieux', 'Qu''elle arrive de nuit en secret'],
    'correct_index', 1,
    'explanation', 'Elle allait vivre uniquement si le roi tendait son sceptre quand elle entrait dans la salle du trône. C''est ce signe qui lui permettait de parler librement.',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que veut dire jeûner ?',
    'choices', array['Prier sans s''arrêter toute la journée', 'Ne pas manger pendant un certain temps pour se consacrer à prier Dieu à la place', 'Lire la Bible pendant trois jours', 'Se mettre à l''écart et ne parler à personne'],
    'correct_index', 1,
    'explanation', 'Jeûner signifie ne pas manger pendant un certain temps pour se consacrer à prier Dieu à la place. C''est un temps mis à part pour être plus proche de Dieu.',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'De quoi Esther a-t-elle fait preuve en allant voir le roi sans y être invitée ?',
    'choices', array['De colère et d''imprudence', 'De curiosité et d''ambition', 'De beaucoup de courage et de foi en Dieu', 'D''obéissance à Mardochée uniquement'],
    'correct_index', 2,
    'explanation', 'La reine Esther a fait preuve de beaucoup de courage, mais aussi de foi en Dieu. Elle savait que sa vie était entre les mains de Dieu.',
    'translation_status', 'source'
  ))),

  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelle est la loi qu''Haman a fait signer au roi ?',
    'choices', array['Une loi pour expulser les Juifs du royaume', 'Une loi pour faire tuer les Juifs à une date précise', 'Une loi pour interdire aux Juifs de prier', 'Une loi pour nommer Haman grand vizir'],
    'correct_index', 1,
    'explanation', 'Haman a fait signer une loi au roi pour faire tuer les Juifs à une date précise. C''est cette loi terrible qu''Esther a voulu empêcher.',
    'translation_status', 'source'
  ))),

  -- PARENTS (4 questions)
  (p_id, 'parents', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quels rôles a joué Mardochée dans cette histoire ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Oui, il a élevé Esther comme sa fille. Il l''a encouragé à rentrer au palais pour essayer de devenir reine. Et lorsqu''elle est devenue reine, il a pu entendre parler du complot contre le peuple juif et en a parlé à Esther.',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Pourquoi Esther a-t-elle choisi de jeûner pendant plusieurs jours avec son peuple ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Se présenter devant le roi sans autorisation pouvait conduire à sa mort, et donc à ce que la loi se réalise (mort du peuple). Egalement, parler au roi d''un complot contre le peuple juif alors qu''il ne sait pas qu''elle est juive était difficile pour elle.

Jeûner était donc important pour elle afin de s''en remettre totalement à Dieu car elle, ne pouvait rien faire.',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Dieu a-t-il fait justice et béni Esther ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Dieu a vu sa foi, son amour pour son peuple et sa détermination.
Dieu a permis que le roi tende le sceptre, réalise la gravité de la loi et punisse Haman.',
    'translation_status', 'source'
  ))),

  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Doit-on jeûner de temps en temps ?',
    'choices', null,
    'correct_index', null,
    'explanation', 'Il n''y a pas d''obligation. Un enfant, une femme enceinte, une personne âgée, une personne qui est malade ou prend un traitement ne devrait pas jeûner pour veiller à sa santé et sa sécurité.

Mais il est vrai que la Bible invite à jeûner, non pas juste pour maigrir en ne mangeant pas, mais pour prendre du temps à part pour Dieu au lieu de manger. Un temps de jeûne est un moment que l''on met à part comme pour dire à notre corps, c''est Dieu qui est plus important que de la simple nourriture. En étant plus faible, je laisse Dieu me parler et agir dans ma vie.',
    'translation_status', 'source'
  )));

end $$;
