# Histoires Bibliques Playmobil — Design Spec
**Date:** 2026-06-04  
**Route:** `/histoires-playmobil`  
**Accès:** Public  
**Playlist YouTube:** `PL7GS8psh4FtaBqggodRFy41FOVwnvKCPv`

---

## 1. Vue d'ensemble

Page de catalogue style Netflix listant toutes les vidéos de la playlist YouTube "Histoires Bibliques Playmobil" de Minilek. Elle se met à jour automatiquement toutes les heures via Next.js ISR. La clé YouTube Data API v3 reste côté serveur.

---

## 2. Architecture des fichiers

```
app/(public)/histoires-playmobil/
  page.tsx                        ← Server Component, revalidate = 3600
                                    Appelle getPlaylist(), passe videos à PlaymobilContent

components/histoires-playmobil/
  PlaymobilContent.tsx            ← Client Component racine (état: featured video, search, info modal)
  HeroSection.tsx                 ← Hero plein écran (thumbnail bg + player embed)
  VideoRow.tsx                    ← Rangée scrollable horizontalement (style Netflix)
  VideoCard.tsx                   ← Carte 16:9 avec hover effect
  InfoModal.tsx                   ← Modale "Plus d'infos" avec description traduite

lib/youtube/
  getPlaylist.ts                  ← Fetch YouTube API avec pagination auto (50/page)
  types.ts                        ← Interface YouTubeVideo { id, title, description, thumbnail, publishedAt }

lib/i18n/
  public-labels.ts                ← +heroPages['histoires-playmobil'] (5 langues)
                                  ← +playmobil section labels (5 langues)
```

---

## 3. Fetch YouTube (lib/youtube/getPlaylist.ts)

- Appel : `GET /youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId={ID}&key={KEY}`
- Pagination : si `nextPageToken` présent → appel récursif jusqu'à récupérer toutes les vidéos
- Tri : du plus récent au plus ancien (`publishedAt` desc)
- Données extraites par vidéo :
  - `videoId` (pour embed + lien)
  - `title`
  - `description` (texte brut, peut être long)
  - `thumbnail.high.url`
  - `publishedAt`
- Clé API : `process.env.YOUTUBE_API_KEY` (jamais dans le code)
- Gestion d'erreur : si l'API échoue → retourne tableau vide, la page affiche un état vide gracieux

---

## 4. Layout de la page

### 4.1 Hero plein écran
- **Fond :** thumbnail haute qualité de la dernière vidéo en background-image, couvrant toute la largeur
- **Overlay :** gradient sombre `linear-gradient(to top, #0f0f0f 20%, transparent 70%)`
- **Contenu (en bas à gauche) :**
  - Titre de la vidéo (`clamp(28px, 5vw, 52px)`, bold blanc)
  - Description YouTube tronquée à 2 lignes (blanc 70%)
  - Bouton `▶ Regarder` (blanc, fond blanc/20, pill)
  - Bouton `ℹ Plus d'infos` (gris, fond blanc/10, pill)
- **État "lecture" :** clic sur Regarder → l'iframe YouTube (`youtube.com/embed/{id}?autoplay=1`) remplace le fond, le hero devient un player 16:9

### 4.2 Barre de recherche
- Icône 🔍 fixe en haut à droite de la page
- Clic → input animé qui s'étend (400ms ease)
- Filtre en temps réel (case-insensitive) sur les titres des vidéos
- Si recherche active → les rangées disparaissent, une grille de résultats s'affiche

### 4.3 Rangées Netflix
Deux rangées scrollables horizontalement :

| Rangée | Contenu |
|---|---|
| "Dernières sorties" | 8 vidéos les plus récentes |
| "Toutes les histoires" | Toute la playlist |

- Flèches `‹ ›` visibles au survol (desktop), swipe natif (mobile)
- Scroll CSS : `overflow-x: auto`, `snap-type: x mandatory`

### 4.4 VideoCard
- Miniature 16:9, `border-radius: 8px`
- **Hover (desktop) :** scale 1.08, z-index élevé, ombre portée, overlay sombre 40%
- **Overlay hover :** titre en bas + bouton ▶ centré
- **Clic :** met la vidéo comme featured hero + scroll smooth vers le haut

---

## 5. Modale "Plus d'infos" (InfoModal)

Déclenchée par le bouton "ℹ Plus d'infos" sur le hero.

- **Fond :** overlay noir 70%, modale centrée `max-w-2xl`
- **Contenu :**
  - Miniature en haut (16:9)
  - Titre
  - Description complète YouTube
  - Bouton `▶ Regarder`
  - Bouton fermer ✕
- **Traduction automatique de la description :**
  - La description française (YouTube) est envoyée à `/api/translate-text` (nouveau endpoint léger)
  - Traduite via Claude Haiku (`claude-haiku-4-5`) à la demande (lazy), résultat mis en cache `localStorage` avec `videoId + locale` comme clé
  - Affiche un skeleton loader pendant la traduction
  - Si déjà en cache → instantané
  - Si locale = `fr` → pas de traduction nécessaire

---

## 6. Nouveau endpoint /api/translate-text

```typescript
POST /api/translate-text
Body: { text: string, targetLang: string, targetLabel: string }
Response: { translated: string }
```

Appelle Claude Haiku pour traduire un texte libre. Séparé de `/api/translate` qui est réservé aux parcours/questions Supabase.

---

## 7. i18n — Nouvelles clés (5 langues : fr, en, es, pt, th)

```typescript
// public-labels.ts heroPages
'histoires-playmobil': {
  title: '🎭 Histoires Playmobil',  // traduit par langue
  subtitle: '...',
  breadcrumb: '...',
}

// Nouveaux labels section playmobil
playmobil: {
  latestReleases: string    // "Dernières sorties"
  allStories: string        // "Toutes les histoires"
  watch: string             // "▶ Regarder"
  moreInfo: string          // "ℹ Plus d'infos"
  searchPlaceholder: string // "Rechercher une histoire..."
  noResults: string         // "Aucune vidéo trouvée"
  loadingDesc: string       // "Traduction en cours..."
}
```

---

## 8. Navigation

### NavBar (ACTIVITY_ITEMS)
```typescript
{ href: '/histoires-playmobil', key: 'histoiresPlaymobil', icon: '/svg/chat-livre.svg' }
```
Label traduit dans les 5 langues (nav.histoiresPlaymobil).

### Homepage — nouvelle section
Entre le hero et le manifeste : section "🎭 Histoires Playmobil" affichant les 4 dernières vidéos en grille horizontale + bouton "Voir toutes →". Fond sombre `#0f0f0f` pour contraster avec le reste de la homepage.

---

## 9. Variables d'environnement

| Variable | Valeur | Ajout |
|---|---|---|
| `YOUTUBE_API_KEY` | `AIzaSyB3RwPdn8_sM2bZPUkwa4iKBpWXrGaiejA` | `.env.local` + Vercel |

---

## 10. Thème visuel

| Élément | Valeur |
|---|---|
| Fond page | `#0f0f0f` |
| Fond cards | `#1a1a1a` |
| Accent primaire | `#006a60` (vert Minilek) |
| Texte principal | `#ffffff` |
| Texte secondaire | `rgba(255,255,255,0.7)` |
| Border radius cards | `8px` |
| Hover scale | `1.08` |

---

## 11. Gestion d'erreurs

- API YouTube quota dépassé → page affiche les vidéos du cache ISR précédent (Vercel garde la dernière version valide)
- Vidéo supprimée de YouTube → card masquée (filtre `thumbnail != null`)
- Traduction échoue → description originale française affichée

---

## 12. Auto-update

`export const revalidate = 3600` sur `page.tsx`. Vercel déclenche un re-fetch en arrière-plan toutes les heures. Aucun cron, aucun webhook. Délai max : 1 heure après publication sur YouTube.
