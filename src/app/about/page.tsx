'use client';

import { CHANNEL_URL } from '@/lib/constants';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: 'About' }]} />

      {/* Hero banner */}
      <div
        className="relative overflow-hidden rounded-xl mb-10"
        style={{
          background: 'linear-gradient(135deg, #3d2914 0%, #5c3d1e 25%, #8b5a3c 50%, #a06b4a 75%, #c17d4f 100%)',
        }}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 opacity-10">
          <DecorativeMotif type="om" color="#fef3c7" />
        </div>
        <div className="relative z-10 px-8 py-10 md:px-10 md:py-12">
          <p className="text-[0.7rem] text-amber-200/60 uppercase tracking-[3px] font-semibold mb-4">
            About the Author
          </p>
          <h1 className="font-heading text-3xl md:text-[2.5rem] font-bold text-amber-50 leading-[1.15]">
            Surekutchi Sivananda Sastry
          </h1>
          <p className="text-sm text-amber-200/60 mt-2 font-semibold tracking-wide">
            M.A. Telugu Literature &amp; Sanskrit
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-[1.05rem] leading-[1.85] text-text-secondary">
          <strong className="text-accent-primary font-semibold">Surekutchi Sivananda Sastry</strong> is a
          firm believer of <strong className="text-accent-primary font-semibold">Sanatana Dharma</strong> &mdash;
          the eternal truth that is embedded deep within the great mythological epics of ancient India.
          His lifelong mission is to bring these sacred teachings{' '}
          <em className="text-accent-secondary font-medium">as-is &mdash; Yadhatadham</em>{' '}
          &mdash; to everyone, preserving their authenticity and spiritual depth.
        </p>

        <p className="text-[1.05rem] leading-[1.85] text-text-secondary">
          Qualified with a Master&apos;s degree in Telugu Literature and Sanskrit, he possesses
          a deep understanding of the original texts in their classical languages. His discourses
          draw from the Vedas, Upanishads, Puranas, the Ramayana, the Mahabharata, the Bhagavad Gita,
          and other sacred scriptures &mdash; presenting profound wisdom learned from authentic
          and diverse sources.
        </p>

        <p className="text-[1.05rem] leading-[1.85] text-text-secondary">
          This website is a comprehensive digital archive of his preachings, delivered in{' '}
          <strong className="text-emerald-700 font-semibold">Telugu</strong>, making these
          timeless teachings accessible to devotees everywhere. Each video is a gateway to deeper
          understanding of Hindu philosophy, mythology, and devotional practices.
        </p>

        <h2 className="font-heading text-[1.5rem] font-semibold text-accent-primary mt-10 mb-4">
          How This Site Works
        </h2>
        <p className="text-[1.05rem] leading-[1.85] text-text-secondary">
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
          weekly to include the latest uploads automatically.
        </p>

        <p className="text-[1.05rem] leading-[1.85] text-text-secondary">
          Videos are organized into five main categories &mdash; Srimadbhagavatam, Ramayanam,
          Mahabharatam, Bhagavad Geetha, and Spiritual Discourses &mdash; with over 60
          sub-sections for easy browsing. You can filter by language and search across the
          entire collection of 10,000+ videos.
        </p>

        <h2 className="font-heading text-[1.5rem] font-semibold text-accent-primary mt-10 mb-4">
          Connect
        </h2>
        <p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-primary text-white rounded-lg
                       text-sm font-semibold uppercase tracking-wide
                       hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-card
                       transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Subscribe on YouTube
          </a>
        </p>
      </div>
    </div>
  );
}
