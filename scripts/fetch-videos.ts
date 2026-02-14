/**
 * YouTube Channel Video Fetcher
 * Fetches all videos from Sivananda Sastry's YouTube channel using YouTube Data API v3.
 * Saves raw data to data/raw/all-videos.json
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const CHANNEL_HANDLE = 'sivanandasastry9364';
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'raw');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'all-videos.json');

export interface RawVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

export async function fetchAllVideos(apiKey: string): Promise<RawVideo[]> {
  const youtube = google.youtube({ version: 'v3', auth: apiKey });

  // Step 1: Get channel ID from handle
  console.log(`Looking up channel @${CHANNEL_HANDLE}...`);
  const searchResponse = await youtube.search.list({
    part: ['snippet'],
    q: CHANNEL_HANDLE,
    type: ['channel'],
    maxResults: 1,
  });

  const channelId = searchResponse.data.items?.[0]?.snippet?.channelId;
  if (!channelId) {
    throw new Error(`Could not find channel @${CHANNEL_HANDLE}`);
  }
  console.log(`Found channel ID: ${channelId}`);

  // Step 2: Get uploads playlist ID
  const channelResponse = await youtube.channels.list({
    part: ['contentDetails', 'snippet', 'statistics'],
    id: [channelId],
  });

  const channel = channelResponse.data.items?.[0];
  if (!channel) {
    throw new Error('Could not fetch channel details');
  }

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    throw new Error('Could not find uploads playlist');
  }

  const channelTitle = channel.snippet?.title || 'Unknown';
  const videoCount = channel.statistics?.videoCount || '?';
  console.log(`Channel: ${channelTitle}`);
  console.log(`Total videos reported: ${videoCount}`);
  console.log(`Uploads playlist: ${uploadsPlaylistId}`);

  // Step 3: Fetch all videos from uploads playlist
  const videos: RawVideo[] = [];
  let nextPageToken: string | undefined = undefined;
  let pageCount = 0;

  console.log('\nFetching videos...');

  while (true) {
    const playlistResponse: Awaited<ReturnType<typeof youtube.playlistItems.list>> = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken: nextPageToken,
    });

    pageCount++;
    const items = playlistResponse.data.items || [];

    for (const item of items) {
      const snippet = item.snippet;
      const contentDetails = item.contentDetails;
      if (!snippet || !contentDetails?.videoId) continue;

      videos.push({
        videoId: contentDetails.videoId,
        title: snippet.title || '',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || '',
        thumbnail: snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url || '',
      });
    }

    console.log(`  Page ${pageCount}: fetched ${items.length} videos (total: ${videos.length})`);

    nextPageToken = playlistResponse.data.nextPageToken || undefined;
    if (!nextPageToken) break;

    // Small delay to be respectful to the API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\nTotal videos fetched: ${videos.length}`);
  return videos;
}

export function saveRawVideos(videos: RawVideo[]): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(videos, null, 2), 'utf-8');
  console.log(`Raw videos saved to ${OUTPUT_FILE}`);
}

export function loadRawVideos(): RawVideo[] {
  if (!fs.existsSync(OUTPUT_FILE)) {
    throw new Error(`${OUTPUT_FILE} not found. Run fetch first.`);
  }
  return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
}

// Run standalone
if (require.main === module) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('ERROR: Set YOUTUBE_API_KEY environment variable');
    process.exit(1);
  }
  fetchAllVideos(apiKey)
    .then(saveRawVideos)
    .catch((err) => {
      console.error('Fetch failed:', err.message);
      process.exit(1);
    });
}
