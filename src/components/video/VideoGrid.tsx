'use client';

import { VideoCard } from './VideoCard';
import type { CompactVideo } from '@/lib/types';

interface VideoGridProps {
  videos: CompactVideo[];
  layout?: 'grid' | 'list';
}

export function VideoGrid({ videos, layout = 'grid' }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-heading font-semibold mb-1">No videos found</p>
        <p className="text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} layout="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
