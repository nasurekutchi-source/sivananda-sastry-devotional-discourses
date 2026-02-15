'use client';

import { YOUTUBE_VIDEO_URL } from '@/lib/constants';
import type { CompactVideo } from '@/lib/types';

interface VideoCardProps {
  video: CompactVideo;
  layout?: 'grid' | 'list';
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

function LanguageBadge({ lang }: { lang: string }) {
  if (lang === 'te') {
    return <span className="lang-badge lang-badge-te">Telugu</span>;
  }
  if (lang === 'mx') {
    return <span className="lang-badge lang-badge-mx">Mixed</span>;
  }
  return <span className="lang-badge lang-badge-en">English</span>;
}

export function VideoCard({ video, layout = 'grid' }: VideoCardProps) {
  if (layout === 'list') {
    return (
      <a
        href={YOUTUBE_VIDEO_URL(video.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-4 bg-bg-tertiary border border-border-light rounded-lg overflow-hidden
                   transition-all duration-200 cursor-pointer
                   hover:shadow-card hover:border-accent-light"
      >
        <div className="relative shrink-0 w-[200px] overflow-hidden">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <img
              src={video.th || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
              alt={video.t}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 bg-accent-primary/90 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 py-3 pr-4 min-w-0">
          <h3 className="font-heading text-[1.05rem] font-semibold text-text-primary leading-snug line-clamp-2 mb-1.5 group-hover:text-accent-primary transition-colors">
            {video.t}
          </h3>
          <div className="flex items-center gap-3 text-[0.75rem] text-text-tertiary">
            <span>{formatDate(video.p)}</span>
            <LanguageBadge lang={video.l} />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={YOUTUBE_VIDEO_URL(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-bg-tertiary border border-border-light rounded-lg overflow-hidden
                 transition-all duration-300 cursor-pointer
                 hover:-translate-y-1 hover:shadow-elevated hover:border-accent-light"
    >
      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary to-accent-light">
          <img
            src={video.th || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.t}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-accent-primary/95 rounded-full flex items-center justify-center shadow-card">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <LanguageBadge lang={video.l} />
        </div>
        <div className="absolute bottom-2 left-3">
          <span className="text-[0.7rem] text-white/90 font-medium">{formatDate(video.p)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-[1.05rem] font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-accent-primary transition-colors">
          {video.t}
        </h3>
      </div>
    </a>
  );
}
