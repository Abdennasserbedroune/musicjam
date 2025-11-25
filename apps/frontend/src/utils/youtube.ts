import { z } from 'zod';

const YOUTUBE_OEMBED_URL = 'https://www.youtube.com/oembed';

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

const OEmbedResponseSchema = z.object({
  title: z.string(),
  thumbnail_url: z.string().optional(),
  author_name: z.string().optional(),
});

export type YouTubeMetadata = {
  title: string;
  thumbnailUrl?: string;
  author?: string;
};

export async function fetchYouTubeMetadata(
  url: string,
): Promise<YouTubeMetadata | null> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }

  try {
    const oembedUrl = `${YOUTUBE_OEMBED_URL}?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const parsed = OEmbedResponseSchema.safeParse(data);

    if (!parsed.success) {
      return null;
    }

    return {
      title: parsed.data.title,
      thumbnailUrl: parsed.data.thumbnail_url,
      author: parsed.data.author_name,
    };
  } catch (error) {
    console.error('Failed to fetch YouTube metadata:', error);
    return null;
  }
}
