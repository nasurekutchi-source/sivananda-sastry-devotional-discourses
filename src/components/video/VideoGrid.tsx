'use client';

import { VideoCard } from './VideoCard';
import type { CompactVideo } from '@/lib/types';

interface VideoGridProps {
  videos: CompactVideo[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16 text-brand-500">
        <p className="text-lg mb-2">No videos found</p>
        <p className="text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
