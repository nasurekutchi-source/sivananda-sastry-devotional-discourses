'use client';

import { SITE_NAME, CHANNEL_URL } from '@/lib/constants';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <h1 className="font-heading text-3xl font-bold text-brand-300 mb-6">
        About {SITE_NAME}
      </h1>

      <div className="prose prose-invert max-w-none space-y-4 text-brand-200 leading-relaxed">
        <p>
          Welcome to the comprehensive digital archive of <strong className="text-brand-300">Sivananda Sastry&apos;s</strong> spiritual
          teachings. This collection encompasses profound discourses on Vedic scriptures,
          sacred hymns, devotional songs, and timeless wisdom from ancient Indian spiritual
          traditions.
        </p>

        <p>
          Sivananda Sastry has dedicated years to sharing the knowledge of the sacred texts
          &mdash; from the grand epics of Ramayana and Mahabharata, to the philosophical depths
          of the Upanishads and Bhagavad Gita, to the devotional beauty of Stotras and Bhajans.
        </p>

        <p>
          The videos are available in both <strong className="text-brand-300">English</strong> and{' '}
          <strong className="text-brand-300">Telugu</strong>, making these teachings accessible
          to a wider audience.
        </p>

        <h2 className="font-heading text-xl font-semibold text-brand-300 mt-8 mb-3">
          How This Site Works
        </h2>
        <p>
          All videos are automatically fetched from the{' '}
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 underline"
          >
            YouTube channel
          </a>{' '}
          and categorized using intelligent pattern matching. The site refreshes its data
          periodically to include the latest uploads.
        </p>

        <p>
          Videos are organized into categories and subcategories for easy browsing. You can
          filter by language (English or Telugu) and search across the entire collection.
        </p>

        <h2 className="font-heading text-xl font-semibold text-brand-300 mt-8 mb-3">
          Connect
        </h2>
        <p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 underline"
          >
            Subscribe on YouTube →
          </a>
        </p>
      </div>
    </div>
  );
}
