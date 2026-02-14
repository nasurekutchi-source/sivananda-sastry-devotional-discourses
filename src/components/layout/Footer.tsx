import { CHANNEL_URL, SITE_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-brand-800 mt-16 py-8 px-4 text-center text-sm text-brand-500">
      <p className="mb-2">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-400 hover:text-brand-300 transition-colors"
        >
          Visit YouTube Channel →
        </a>
      </p>
      <p>
        {SITE_NAME} &middot; Sacred Teachings &amp; Spiritual Wisdom
      </p>
    </footer>
  );
}
