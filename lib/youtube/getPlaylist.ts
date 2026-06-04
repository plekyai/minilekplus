// lib/youtube/getPlaylist.ts
import type { YouTubeVideo } from './types'

const PLAYLIST_ID = 'PL7GS8psh4FtaBqggodRFy41FOVwnvKCPv'
const PODCAST_PLAYLIST_ID = 'PL7GS8psh4FtaAPM0ITd5zes5dX6tgfULk'

interface YTSnippet {
  title: string
  description: string
  thumbnails: {
    maxres?: { url: string }
    high?: { url: string }
    medium?: { url: string }
  }
  resourceId: { videoId: string }
}

interface YTContentDetails {
  videoPublishedAt: string
}

interface YTItem {
  snippet: YTSnippet
  contentDetails: YTContentDetails
}

interface YTPage {
  nextPageToken?: string
  items: YTItem[]
}

function mapItems(items: YTItem[]): YouTubeVideo[] {
  return items
    .filter(item => {
      const t = item.snippet.title
      return item.snippet.resourceId.videoId && t !== 'Deleted video' && t !== 'Private video'
    })
    .map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ??
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
      publishedAt: item.contentDetails.videoPublishedAt,
    }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

async function fetchAllPages(playlistId: string): Promise<YTItem[]> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YOUTUBE_API_KEY not set')

  const all: YTItem[] = []
  let pageToken: string | undefined

  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    url.searchParams.set('part', 'snippet,contentDetails')
    url.searchParams.set('maxResults', '50')
    url.searchParams.set('playlistId', playlistId)
    url.searchParams.set('key', key)
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers: { Referer: 'https://plus.minilek.com' },
    })
    if (!res.ok) throw new Error(`YouTube API ${res.status}: ${await res.text()}`)
    const page: YTPage = await res.json()
    all.push(...page.items)
    pageToken = page.nextPageToken
  } while (pageToken)

  return all
}

export async function getPlaylist(): Promise<YouTubeVideo[]> {
  try {
    return mapItems(await fetchAllPages(PLAYLIST_ID))
  } catch (err) {
    console.error('[getPlaylist]', err)
    return []
  }
}

export async function getPodcastPlaylist(): Promise<YouTubeVideo[]> {
  try {
    return mapItems(await fetchAllPages(PODCAST_PLAYLIST_ID))
  } catch (err) {
    console.error('[getPodcastPlaylist]', err)
    return []
  }
}
