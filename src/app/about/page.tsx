'use client';

import { SITE_NAME, CHANNEL_URL } from '@/lib/constants';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <div className="ornament mb-8" />

      <h1 className="font-heading text-[2.75rem] font-semibold text-accent-primary mb-5 leading-[1.2]">
        About {SITE_NAME}
      </h1>

      <div className="space-y-5">
        <p className="text-[1.05rem] leading-[1.8] text-text-secondary">
          Welcome to the comprehensive digital archive of <strong className="text-accent-primary font-semibold">Sivananda Sastry&apos;s</strong> spiritual
          teachings. This collection encompasses profound discourses on Vedic scriptures,
          sacred hymns, devotional songs, and timeless wisdom from ancient Indian spiritual
          traditions.
        </p>

        <p className="text-[1.05rem] leading-[1.8] text-text-secondary">
          Sivananda Sastry has dedicated years to sharing the knowledge of the sacred texts
          &mdash; from the grand epics of Ramayana and Mahabharata, to the philosophical depths
          of the Upanishads and Bhagavad Gita, to the devotional beauty of Stotras and Bhajans.
        </p>

        <p className="text-[1.05rem] leading-[1.8] text-text-secondary">
          The videos are available in both <strong className="text-accent-primary font-semibold">English</strong> and{' '}
          <strong className="text-accent-primary font-semibold">Telugu</strong>, making these teachings accessible
          to a wider audience.
        </p>

        <h2 className="font-heading text-[1.5rem] font-semibold text-accent-primary mt-10 mb-4">
          How This Site Works
        </h2>
        <p className="text-[1.05rem] leading-[1.8] text-text-secondary">
          All videos are automatically fetched from the{' '}
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-secondary hover:text-accent-primary underline transition-colors"
          >
            YouTube channel
          </a>{' '}
          and categorized using intelligent pattern matching. The site refreshes its data
          periodically to include the latest uploads.
        </p>

        <p className="text-[1.05rem] leading-[1.8] text-text-secondary">
          Videos are organized into categories and subcategories for easy browsing. You can
          filter by language (English or Telugu) and search across the entire collection.
        </p>

        <h2 className="font-heading text-[1.5rem] font-semibold text-accent-primary mt-10 mb-4">
          Connect
        </h2>
        <p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-accent-primary text-white rounded
                       text-sm font-semibold uppercase tracking-wide
                       hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-card
                       transition-all duration-300"
          >
            Subscribe on YouTube
          </a>
        </p>
      </div>
    </div>
  );
}
