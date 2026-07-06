const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/

export function extractYouTubeId(url: string): string | null {
  return url.match(YOUTUBE_ID_PATTERN)?.[1] ?? null
}
