'use client';

import { YOUTUBE_VIDEO_URL } from '@/lib/constants';
import type { CompactVideo } from '@/lib/types';

interface VideoCardProps {
  video: CompactVideo;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function LanguageBadge({ lang }: { lang: string }) {
  if (lang === 'telugu') {
    return <span className="lang-badge lang-badge-te">TE</span>;
  }
  if (lang === 'mixed') {
    return <span className="lang-badge lang-badge-mx">MX</span>;
  }
  return <span className="lang-badge lang-badge-en">EN</span>;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={YOUTUBE_VIDEO_URL(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-brand-800 border border-brand-700 rounded-lg overflow-hidden
                 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-950/50
                 transition-all duration-200 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-brand-900 overflow-hidden">
        <img
          src={video.th || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.t}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-14 h-14 bg-brand-300/90 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-950 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Language badge */}
        <div className="absolute top-2 right-2">
          <LanguageBadge lang={video.l} />
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-heading text-sm font-medium text-brand-100 leading-snug line-clamp-2 mb-1.5">
          {video.t}
        </h3>
        {video.d && (
          <p className="text-xs text-brand-400 line-clamp-2 mb-2">
            {video.d}
          </p>
        )}
        <p className="text-xs text-brand-500">
          {formatDate(video.p)}
        </p>
      </div>
    </a>
  );
}
