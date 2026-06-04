// lib/youtube/getPlaylist.ts
import type { YouTubeVideo } from './types'

const PLAYLIST_ID = 'PL7GS8psh4FtaBqggodRFy41FOVwnvKCPv'

interface YTSnippet {
  publishedAt: string
  title: string
  description: string
  thumbnails: {
    maxres?: { url: string }
    high?: { url: string }
    medium?: { url: string }
  }
  resourceId: { videoId: string }
}

interface YTPage {
  nextPageToken?: string
  items: { snippet: YTSnippet }[]
}

async function fetchPage(pageToken?: string): Promise<YTPage> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YOUTUBE_API_KEY not set')

  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('maxResults', '50')
  url.searchParams.set('playlistId', PLAYLIST_ID)
  url.searchParams.set('key', key)
  if (pageToken) url.searchParams.set('pageToken', pageToken)

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`YouTube API ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function getPlaylist(): Promise<YouTubeVideo[]> {
  try {
    const all: { snippet: YTSnippet }[] = []
    let pageToken: string | undefined

    do {
      const page = await fetchPage(pageToken)
      all.push(...page.items)
      pageToken = page.nextPageToken
    } while (pageToken)

    return all
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
        publishedAt: item.snippet.publishedAt,
      }))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (err) {
    console.error('[getPlaylist]', err)
    return []
  }
}
