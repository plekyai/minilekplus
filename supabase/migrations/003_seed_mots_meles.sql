-- 003_seed_mots_meles.sql
-- Premier puzzle Mots Mêlés : La pièce retrouvée

insert into word_search_puzzles (
  slug, mode, translations, tags, tier, published, order_index
) values (
  'la-piece-retrouvee',
  'parcours',
  jsonb_build_object(
    'fr', jsonb_build_object(
      'title',        'La pièce retrouvée',
      'description',  'Retrouve les mots cachés de la parabole de Jésus !',
      'words',        to_jsonb(array['PIECE','DAME','MAISON','JOIE','AMIES','JESUS','ANGES','BALAI','LUMIERE','DIEU']),
      'displayWords', to_jsonb(array['Pièce','Dame','Maison','Joie','Amies','Jésus','Anges','Balai','Lumière','Dieu'])
    ),
    'en', jsonb_build_object(
      'title',        'The Lost Coin',
      'description',  'Find the hidden words from Jesus'' parable!',
      'words',        to_jsonb(array['COIN','WOMAN','HOUSE','JOY','FRIENDS','JESUS','ANGELS','BROOM','LIGHT','GOD']),
      'displayWords', to_jsonb(array['Coin','Woman','House','Joy','Friends','Jesus','Angels','Broom','Light','God'])
    ),
    'pt', jsonb_build_object(
      'title',        'A Moeda Perdida',
      'description',  'Encontre as palavras escondidas da parábola de Jesus!',
      'words',        to_jsonb(array['MOEDA','MULHER','CASA','ALEGRIA','AMIGAS','JESUS','ANJOS','VASSOURA','LUZ','DEUS']),
      'displayWords', to_jsonb(array['Moeda','Mulher','Casa','Alegria','Amigas','Jesus','Anjos','Vassoura','Luz','Deus'])
    ),
    'th', jsonb_build_object(
      'title',        'เหรียญที่หายไป',
      'description',  'หาคำที่ซ่อนอยู่จากคำอุปมาของพระเยซู!',
      'words',        to_jsonb(array['COIN','WOMAN','HOUSE','JOY','FRIENDS','JESUS','ANGELS','BROOM','LIGHT','GOD']),
      'displayWords', to_jsonb(array['เหรียญ','หญิง','บ้าน','ความยินดี','เพื่อน','พระเยซู','เทวดา','ไม้กวาด','แสงสว่าง','พระเจ้า'])
    )
  ),
  array['parabole','joie','Jesus'],
  'free',
  true,
  0
);
