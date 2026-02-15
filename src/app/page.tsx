'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';
import { Footer } from '@/components/layout/Footer';
import { CHANNEL_URL } from '@/lib/constants';
import { getCategoryTheme, CATEGORY_THEMES } from '@/lib/categoryThemes';
import type { CategoriesData, CompactVideo } from '@/lib/types';

export default function HomePage() {
  const [categories, setCategories] = useState<CategoriesData | null>(null);
  const [recentVideos, setRecentVideos] = useState<CompactVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    Promise.all([
      fetch(`${basePath}/data/processed/categories.json`).then((r) => r.json()),
      fetch(`${basePath}/data/processed/recent.json`)
        .then((r) => r.json())
        .then((d) => d.videos),
    ])
      .then(([cats, recent]) => {
        setCategories(cats);
        setRecentVideos(recent);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const visibleCategories = categories?.categories.filter((c) => c.videoCount > 0) || [];
  const totalSubsections = visibleCategories.reduce(
    (sum, c) => sum + c.subcategories.filter((s) => s.videoCount > 0).length,
    0
  );

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section - About the Author */}
      <section
        className="relative overflow-hidden rounded-xl mb-10"
        style={{
          background:
            'linear-gradient(135deg, #3d2914 0%, #5c3d1e 20%, #8b5a3c 45%, #a06b4a 65%, #c17d4f 85%, #d4a574 100%)',
        }}
      >
        <div className="absolute -left-8 -bottom-8 w-36 h-36 opacity-[0.06] rotate-12">
          <DecorativeMotif type="lotus" color="#fef3c7" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-8 py-10 md:px-12 md:py-14">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Bio content */}
            <div className="flex-1 min-w-0">
              <p className="text-[0.7rem] text-amber-200/60 uppercase tracking-[3px] font-semibold mb-4">
                About the Author
              </p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-amber-50 leading-[1.15] mb-4">
                Surekutchi Sivananda Sastry
              </h2>
              <p className="text-[0.65rem] text-amber-300/50 uppercase tracking-[2px] font-semibold mb-5">
                M.A. Telugu Literature &amp; Sanskrit
              </p>
              <p className="text-sm md:text-base text-amber-100/85 leading-relaxed mb-3">
                A firm believer of <strong className="text-amber-100">Sanatana Dharma</strong> &mdash;
                the eternal, universal truth that lies at the heart of India&apos;s great spiritual heritage &mdash;
                Surekutchi Sivananda Sastry has dedicated his life to preserving and sharing these sacred teachings
                {' '}<em className="text-amber-200/90">as-is (Yadhatadham)</em>, without dilution or
                modern reinterpretation.
              </p>
              <p className="text-sm text-amber-100/65 leading-relaxed mb-3">
                His discourses draw deeply from the <strong className="text-amber-100/80">Vedas, Upanishads,
                Puranas, Ramayana, Mahabharata, Bhagavad Gita</strong>, and other foundational scriptures.
                Qualified with a Master&apos;s degree in Telugu Literature &amp; Sanskrit, he brings
                both scholarly depth and devotional sincerity to every teaching.
              </p>
              <p className="text-sm text-amber-100/50 leading-relaxed mb-6">
                With over {categories?.totalVideos.toLocaleString() || '10,000'} video discourses delivered
                in Telugu, this archive represents one of the most comprehensive collections of
                authentic Vedic and Puranic teachings available today.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { value: categories?.totalVideos.toLocaleString() || '0', label: 'Videos' },
                  { value: visibleCategories.length.toString(), label: 'Categories' },
                  { value: totalSubsections.toString(), label: 'Sections' },
                  { value: 'Telugu', label: 'Language' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <span className="font-heading text-lg font-bold text-amber-100">{stat.value}</span>
                    <span className="text-[0.6rem] text-amber-200/60 uppercase tracking-wider font-semibold">{stat.label}</span>
                  </div>
                ))}
              </div>

              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 text-amber-50
                           rounded-full text-sm font-semibold
                           border border-white/20
                           hover:bg-white/25 hover:-translate-y-0.5
                           transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Visit YouTube Channel
              </a>
            </div>

            {/* Author Photo */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <div className="w-48 h-56 md:w-56 md:h-64 rounded-xl overflow-hidden border-2 border-amber-200/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/author.jpeg`}
                    alt="Surekutchi Sivananda Sastry"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 opacity-20">
                  <DecorativeMotif type="om" color="#fef3c7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey - Horizontal Milestone Timeline */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-0.5 bg-accent-primary" />
          <h2 className="font-heading text-2xl font-semibold text-accent-primary">
            The Journey
          </h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mb-7 ml-14">
          The journey started with casual <em>satsang</em> and then reciting the Bhagavad Geetha &mdash;
          it then translated into getting deeper into each of our great epics, and so the journey began.
        </p>

        {/* Horizontal timeline */}
        <div className="ml-14 overflow-x-auto pb-2">
          <div className="flex items-start min-w-[600px]">
            {(() => {
              const journeyOrder = [
                { id: 'spiritual-discourses', label: 'Spiritual\nDiscourses', shortLabel: 'Satsang' },
                { id: 'bhagavadgeetha', label: 'Bhagavad\nGeetha', shortLabel: 'Geetha' },
                { id: 'mahabharatam', label: 'Mahabhara-\ntam', shortLabel: 'Mahabharat' },
                { id: 'srimadbhagavatam', label: 'Srimadbhaga-\nvatam', shortLabel: 'Bhagavatam' },
                { id: 'ramayanam', label: 'Ramayanam', shortLabel: 'Ramayanam' },
              ];

              return journeyOrder.map((item, i) => {
                const itemTheme = getCategoryTheme(item.id);
                const cat = visibleCategories.find((c) => c.id === item.id);
                const date = new Date(itemTheme.journeyStarted + 'T00:00:00');
                const formatted = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

                return (
                  <div key={item.id} className="flex items-start" style={{ flex: 1 }}>
                    {/* Milestone node */}
                    <Link
                      href={`/${item.id}/`}
                      className="group flex flex-col items-center shrink-0 w-[90px]"
                    >
                      {/* Date above */}
                      <span className="text-[0.6rem] font-bold text-text-tertiary uppercase tracking-wide mb-2">
                        {formatted}
                      </span>
                      {/* Dot */}
                      <div
                        className="w-4 h-4 rounded-full border-[3px] border-white shadow-md group-hover:scale-125 transition-transform"
                        style={{ background: itemTheme.accentColor }}
                      />
                      {/* Label below */}
                      <span className="text-[0.7rem] font-semibold text-text-primary text-center mt-2 leading-tight group-hover:text-accent-primary transition-colors">
                        {item.shortLabel}
                      </span>
                      {cat && (
                        <span className="text-[0.55rem] font-bold text-text-tertiary mt-0.5">
                          {cat.videoCount.toLocaleString()}
                        </span>
                      )}
                    </Link>

                    {/* Connecting line */}
                    {i < journeyOrder.length - 1 && (
                      <div className="flex-1 flex items-center mt-[26px]">
                        <div className="w-full h-[2px] rounded-full" style={{
                          background: `linear-gradient(90deg, ${itemTheme.accentColor}, ${getCategoryTheme(journeyOrder[i + 1].id).accentColor})`,
                        }} />
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>

          {/* Duration note */}
          <p className="text-[0.7rem] text-text-tertiary italic mt-4 text-center">
            {(() => {
              const start = new Date('2014-10-31T00:00:00');
              const now = new Date();
              const years = Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
              return `${years}+ years of preserving sacred teachings as-is (Yadhatadham)`;
            })()}
          </p>
        </div>
      </section>

      {/* Browse by Topic - with distribution bars integrated */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-7">
          <div className="w-10 h-0.5 bg-accent-primary" />
          <h2 className="font-heading text-2xl font-semibold text-accent-primary">
            Browse by Topic
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleCategories
            .sort((a, b) => b.videoCount - a.videoCount)
            .map((cat) => {
              const theme = getCategoryTheme(cat.id);
              const visibleSubCount = cat.subcategories.filter((s) => s.videoCount > 0).length;
              const topSubs = cat.subcategories
                .filter((s) => s.videoCount > 0 && s.id !== 'general')
                .sort((a, b) => b.videoCount - a.videoCount)
                .slice(0, 4);

              return (
                <Link
                  key={cat.id}
                  href={`/${cat.id}/`}
                  className="group block rounded-xl border border-border-light bg-white
                             shadow-subtle hover:shadow-card
                             transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Colored top bar */}
                  <div className="h-1.5" style={{ background: theme.gradient }} />

                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-xl md:text-[1.4rem] font-bold text-text-primary leading-snug group-hover:text-accent-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[0.75rem] text-text-tertiary mt-1 leading-relaxed">
                          {theme.description}
                        </p>
                      </div>
                      <span className="shrink-0 ml-4 text-[0.7rem] font-bold text-text-tertiary bg-bg-secondary px-2.5 py-1 rounded-full">
                        {cat.videoCount.toLocaleString()}
                      </span>
                    </div>

                    {/* Subcategory list */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {topSubs.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-semibold
                                     bg-bg-secondary text-text-secondary border border-border-light"
                        >
                          {sub.name}
                          <span className="ml-1.5 text-text-tertiary">{sub.videoCount}</span>
                        </span>
                      ))}
                      {visibleSubCount > 4 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-semibold text-text-tertiary">
                          +{visibleSubCount - 4} more
                        </span>
                      )}
                    </div>

                    {/* Footer with arrow */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-light">
                      <span className="text-[0.7rem] text-text-tertiary">
                        {visibleSubCount} sections
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-accent-secondary font-semibold group-hover:text-accent-primary transition-colors">
                        Browse
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-10 h-0.5 bg-accent-primary" />
            <h2 className="font-heading text-2xl font-semibold text-accent-primary">
              Recently Added
            </h2>
          </div>
          <VideoGrid videos={recentVideos.slice(0, 12)} />
        </section>
      )}

      <Footer />
    </div>
  );
}
