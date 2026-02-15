import { CHANNEL_URL, SITE_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border-light mt-16 py-8 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.75rem] text-text-tertiary">
        <p className="font-heading text-sm text-text-secondary">
          {SITE_NAME} &middot; Spiritual Teachings
        </p>
        <div className="flex items-center gap-4">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent-secondary hover:text-accent-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            YouTube Channel
          </a>
        </div>
      </div>
    </footer>
  );
}
