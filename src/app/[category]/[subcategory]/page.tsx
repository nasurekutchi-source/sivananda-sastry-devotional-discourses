'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { VideoGrid } from '@/components/video/VideoGrid';
import { Pagination } from '@/components/ui/Pagination';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VIDEOS_PER_PAGE } from '@/lib/constants';
import type { CategoriesData, CompactVideo, Language } from '@/lib/types';

type LangFilter = Language | 'all';

export default function SubcategoryPage() {
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
      fetch(`${basePath}/data/processed/videos-by-category/${subcategoryId}.json`)
        .then((r) => r.json())
        .then((d) => d.videos as CompactVideo[]),
    ])
      .then(([cats, vids]) => {
        setCategoriesData(cats);
        setVideos(vids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [subcategoryId]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [langFilter]);

  const category = categoriesData?.categories.find((c) => c.id === categoryId);
  const subcategory = category?.subcategories.find((s) => s.id === subcategoryId);

  // Filter by language
  const filteredVideos = useMemo(() => {
    if (langFilter === 'all') return videos;
    return videos.filter((v) => v.l === langFilter);
  }, [videos, langFilter]);

  // Language counts
  const langCounts = useMemo(() => {
    const counts = { english: 0, telugu: 0, mixed: 0, all: videos.length };
    for (const v of videos) {
      counts[v.l]++;
    }
    return counts;
  }, [videos]);

  // Paginate
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const pageVideos = filteredVideos.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  if (loading) return <LoadingSpinner />;

  if (!category || !subcategory) {
    return (
      <div className="text-center py-16">
        <h1 className="font-heading text-2xl text-brand-300 mb-4">Not Found</h1>
        <Link href="/" className="text-brand-400 hover:text-brand-300">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: category.name, href: `/${category.id}/` },
          { label: subcategory.name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-300">
            {subcategory.name}
          </h1>
          <p className="text-sm text-brand-500 mt-1">
            {filteredVideos.length} videos
            {langFilter !== 'all' && ` (filtered from ${videos.length})`}
            {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
          </p>
        </div>

        {/* Language filter - only show if multiple languages exist */}
        {(langCounts.english > 0 && langCounts.telugu > 0) && (
          <LanguageToggle
            value={langFilter}
            onChange={setLangFilter}
            counts={langCounts}
          />
        )}
      </div>

      {/* Video Grid */}
      <VideoGrid videos={pageVideos} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
