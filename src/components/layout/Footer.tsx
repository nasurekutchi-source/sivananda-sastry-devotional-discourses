import { CHANNEL_URL } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border-light mt-16 py-8 px-4 text-center text-[0.75rem] text-text-tertiary">
      <p>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-secondary hover:text-accent-primary transition-colors"
        >
          Visit YouTube Channel
        </a>
      </p>
    </footer>
  );
}
