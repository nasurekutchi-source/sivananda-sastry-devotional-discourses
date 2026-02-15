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
      month: 'long',
      day: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function LanguageBadge({ lang }: { lang: string }) {
  if (lang === 'te') {
    return <span className="lang-badge lang-badge-te">TE</span>;
  }
  if (lang === 'mx') {
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
      className="group block bg-bg-tertiary border border-border-light rounded-md overflow-hidden
                 transition-all duration-300 cursor-pointer
                 hover:-translate-y-1.5 hover:shadow-elevated hover:border-accent-light"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary to-accent-light">
          <img
            src={video.th || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.t}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.08]"
          />
        </div>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[60px] h-[60px] bg-accent-primary/95 rounded-full flex items-center justify-center
                         shadow-card transition-all duration-300 group-hover:bg-accent-primary group-hover:scale-110">
            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Language badge */}
        <div className="absolute top-3 right-3">
          <LanguageBadge lang={video.l} />
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-heading text-[1.15rem] font-semibold text-text-primary leading-[1.4] line-clamp-2 mb-2">
          {video.t}
        </h3>
        <p className="text-[0.8rem] text-text-tertiary tracking-wide">
          {formatDate(video.p)}
        </p>
      </div>
    </a>
  );
}
