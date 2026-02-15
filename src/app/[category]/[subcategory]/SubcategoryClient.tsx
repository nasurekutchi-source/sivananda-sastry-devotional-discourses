'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { Pagination } from '@/components/ui/Pagination';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';
import { getCategoryTheme } from '@/lib/categoryThemes';
import { VIDEOS_PER_PAGE } from '@/lib/constants';
import type { CategoriesData, CompactVideo, Language } from '@/lib/types';

type LangFilter = Language | 'all';
type SortOption = 'newest' | 'oldest' | 'title-az' | 'title-za';
type ViewMode = 'grid' | 'list';

export default function SubcategoryClient() {
  const params = useParams();
  const categoryId = params.category as string;
  const subcategoryId = params.subcategory as string;

  const [categoriesData, setCategoriesData] = useState<CategoriesData | null>(null);
  const [videos, setVideos] = useState<CompactVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    Promise.all([
      fetch(`${basePath}/data/processed/categories.json`).then((r) => r.json()),
      fetch(`${basePath}/data/processed/videos-by-category/${categoryId}/${subcategoryId}.json`)
        .then((r) => r.json())
        .then((d) => d.videos as CompactVideo[]),
    ])
      .then(([cats, vids]) => {
        setCategoriesData(cats);
        setVideos(vids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [langFilter, sortBy]);

  const category = categoriesData?.categories.find((c) => c.id === categoryId);
  const subcategory = category?.subcategories.find((s) => s.id === subcategoryId);
  const theme = getCategoryTheme(categoryId);

  const langCounts = useMemo(() => {
    const counts = { en: 0, te: 0, mx: 0, all: videos.length };
    for (const v of videos) {
      if (v.l === 'en') counts.en++;
      else if (v.l === 'te') counts.te++;
      else if (v.l === 'mx') counts.mx++;
    }
    return counts;
  }, [videos]);

  const filteredAndSorted = useMemo(() => {
    let result = langFilter === 'all' ? [...videos] : videos.filter((v) => v.l === langFilter);

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.p.localeCompare(a.p));
        break;
      case 'oldest':
        result.sort((a, b) => a.p.localeCompare(b.p));
        break;
      case 'title-az':
        result.sort((a, b) => a.t.localeCompare(b.t));
        break;
      case 'title-za':
        result.sort((a, b) => b.t.localeCompare(a.t));
        break;
    }
    return result;
  }, [videos, langFilter, sortBy]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalPages = Math.ceil(filteredAndSorted.length / VIDEOS_PER_PAGE);
  const pageVideos = filteredAndSorted.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  // Sibling subcategories for quick navigation
  const siblings = category?.subcategories.filter((s) => s.videoCount > 0 && s.id !== subcategoryId) || [];

  if (loading) return <LoadingSpinner />;

  if (!category || !subcategory) {
    return (
      <div className="text-center py-16">
        <h1 className="font-heading text-2xl text-accent-primary mb-4">Not Found</h1>
        <Link href="/" className="text-accent-secondary hover:text-accent-primary transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const hasMultipleLanguages = langCounts.en > 0 && langCounts.te > 0;
  const displayName = subcategory.name === 'General' ? 'Other Videos' : subcategory.name;

  return (
    <div className="animate-fade-in-up">
      <Breadcrumbs
        items={[
          { label: category.name, href: `/${category.id}/` },
          { label: displayName },
        ]}
      />

      {/* Themed header */}
      <div className="relative overflow-hidden rounded-xl mb-8" style={{ background: theme.gradient }}>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 md:w-40 md:h-40 opacity-15">
          <DecorativeMotif type={theme.motif} color={theme.textColor} />
        </div>
        <div className="relative z-10 px-6 py-6 md:px-10 md:py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl md:text-3xl">{category.icon}</span>
            <div>
              <h1
                className="font-heading text-2xl md:text-[2rem] font-bold leading-tight"
                style={{ color: theme.textColor }}
              >
                {displayName}
              </h1>
              <p className="text-sm opacity-70 mt-0.5" style={{ color: theme.textColor }}>
                {category.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textColor }}
            >
              {filteredAndSorted.length} videos
              {langFilter !== 'all' && ` (of ${videos.length})`}
            </span>
            {totalPages > 1 && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textColor }}
              >
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content area with filter sidebar */}
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar: sort + view toggle */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-light">
            <div className="flex items-center gap-3">
              <label className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm bg-bg-tertiary border border-border-medium rounded-lg px-3 py-1.5
                           text-text-primary cursor-pointer focus:outline-none focus:border-accent-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-az">Title A-Z</option>
                <option value="title-za">Title Z-A</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-bg-secondary rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                  ? 'bg-bg-tertiary shadow-sm text-accent-primary'
                  : 'text-text-tertiary hover:text-text-primary'}`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                  ? 'bg-bg-tertiary shadow-sm text-accent-primary'
                  : 'text-text-tertiary hover:text-text-primary'}`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <VideoGrid videos={pageVideos} layout={viewMode} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Right sidebar - filters & navigation */}
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Language filter */}
            {hasMultipleLanguages && (
              <div className="bg-bg-tertiary border border-border-light rounded-xl p-5">
                <h3 className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-3">
                  Language
                </h3>
                <div className="space-y-1.5">
                  {[
                    { key: 'all' as LangFilter, label: 'All Languages', count: langCounts.all },
                    { key: 'en' as LangFilter, label: 'English', count: langCounts.en },
                    { key: 'te' as LangFilter, label: 'Telugu', count: langCounts.te },
                    ...(langCounts.mx > 0
                      ? [{ key: 'mx' as LangFilter, label: 'Mixed', count: langCounts.mx }]
                      : []),
                  ].map(({ key, label, count }) =>
                    count > 0 ? (
                      <button
                        key={key}
                        onClick={() => setLangFilter(key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                          ${langFilter === key
                            ? 'bg-accent-primary text-white font-semibold'
                            : 'text-text-secondary hover:bg-bg-secondary'}`}
                      >
                        <span>{label}</span>
                        <span className={`text-xs font-mono ${langFilter === key ? 'text-white/80' : 'text-text-tertiary'}`}>
                          {count}
                        </span>
                      </button>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div className="bg-bg-tertiary border border-border-light rounded-xl p-5">
              <h3 className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Total Videos</span>
                  <span className="font-semibold text-text-primary">{videos.length}</span>
                </div>
                {langCounts.en > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">English</span>
                    <span className="font-semibold text-blue-600">{langCounts.en}</span>
                  </div>
                )}
                {langCounts.te > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Telugu</span>
                    <span className="font-semibold text-emerald-600">{langCounts.te}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Per Page</span>
                  <span className="font-semibold text-text-primary">{VIDEOS_PER_PAGE}</span>
                </div>
              </div>
            </div>

            {/* Sibling subcategories */}
            {siblings.length > 0 && (
              <div className="bg-bg-tertiary border border-border-light rounded-xl p-5">
                <h3 className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-3">
                  Other Sections
                </h3>
                <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
                  {siblings.map((sib) => (
                    <Link
                      key={sib.id}
                      href={`/${categoryId}/${sib.id}/`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm
                                 text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors"
                    >
                      <span className="truncate mr-2">
                        {sib.name === 'General' ? 'Other Videos' : sib.name}
                      </span>
                      <span className="text-xs text-text-tertiary shrink-0">{sib.videoCount}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile language filter (below grid on small screens) */}
      {hasMultipleLanguages && (
        <div className="lg:hidden mt-6 p-4 bg-bg-secondary border border-border-light rounded-lg">
          <span className="block text-xs text-accent-primary uppercase tracking-wider font-semibold mb-2">
            Filter by Language
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all' as LangFilter, label: 'All', count: langCounts.all },
              { key: 'en' as LangFilter, label: 'English', count: langCounts.en },
              { key: 'te' as LangFilter, label: 'Telugu', count: langCounts.te },
            ].map(({ key, label, count }) =>
              count > 0 ? (
                <button
                  key={key}
                  onClick={() => setLangFilter(key)}
                  className={`filter-btn ${langFilter === key ? 'filter-btn-active' : ''}`}
                >
                  {label} ({count})
                </button>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
