'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { Pagination } from '@/components/ui/Pagination';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DecorativeMotif } from '@/components/ui/DecorativeMotif';
import { getCategoryTheme } from '@/lib/categoryThemes';
import { VIDEOS_PER_PAGE } from '@/lib/constants';
import type { CategoriesData, CompactVideo, Language } from '@/lib/types';

type LangFilter = Language | 'all';

export default function SubcategoryClient() {
  const params = useParams();
  const categoryId = params.category as string;
  const subcategoryId = params.subcategory as string;

  const [categoriesData, setCategoriesData] = useState<CategoriesData | null>(null);
  const [videos, setVideos] = useState<CompactVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [langFilter, setLangFilter] = useState<LangFilter>('all');

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
  }, [langFilter]);

  const category = categoriesData?.categories.find((c) => c.id === categoryId);
  const subcategory = category?.subcategories.find((s) => s.id === subcategoryId);
  const theme = getCategoryTheme(categoryId);

  const filteredVideos = useMemo(() => {
    if (langFilter === 'all') return videos;
    return videos.filter((v) => v.l === langFilter);
  }, [videos, langFilter]);

  const langCounts = useMemo(() => {
    const counts = { en: 0, te: 0, mx: 0, all: videos.length };
    for (const v of videos) {
      if (v.l === 'en') counts.en++;
      else if (v.l === 'te') counts.te++;
      else if (v.l === 'mx') counts.mx++;
    }
    return counts;
  }, [videos]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const pageVideos = filteredVideos.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

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

  return (
    <div className="animate-fade-in-up">
      <Breadcrumbs
        items={[
          { label: category.name, href: `/${category.id}/` },
          { label: subcategory.name },
        ]}
      />

      {/* Themed header */}
      <div className="relative overflow-hidden rounded-lg mb-8" style={{ background: theme.gradient }}>
        {/* Small decorative motif */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 opacity-20">
          <DecorativeMotif type={theme.motif} color={theme.textColor} />
        </div>

        <div className="relative z-10 px-6 py-6 md:px-10 md:py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl md:text-3xl">{category.icon}</span>
            <h1
              className="font-heading text-2xl md:text-[2rem] font-bold"
              style={{ color: theme.textColor }}
            >
              {subcategory.name === 'General' ? 'Other Videos' : subcategory.name}
            </h1>
          </div>
          <p className="text-sm opacity-80" style={{ color: theme.textColor }}>
            {filteredVideos.length} videos
            {langFilter !== 'all' && ` (filtered from ${videos.length})`}
            {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
          </p>
        </div>
      </div>

      {/* Language filter */}
      {(langCounts.en > 0 && langCounts.te > 0) && (
        <div className="mb-8 p-5 bg-bg-secondary border border-border-light rounded-lg">
          <span className="block text-[0.8rem] text-accent-primary uppercase tracking-[1.5px] font-semibold mb-3">
            Filter by Language
          </span>
          <LanguageToggle
            value={langFilter}
            onChange={setLangFilter}
            counts={langCounts}
          />
        </div>
      )}

      <VideoGrid videos={pageVideos} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
