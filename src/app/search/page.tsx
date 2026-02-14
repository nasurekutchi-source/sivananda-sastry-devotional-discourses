'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { VideoGrid } from '@/components/video/VideoGrid';
import { Pagination } from '@/components/ui/Pagination';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VIDEOS_PER_PAGE } from '@/lib/constants';
import type { CategoriesData, CompactVideo, Language } from '@/lib/types';

type LangFilter = Language | 'all';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [allVideos, setAllVideos] = useState<CompactVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [langFilter, setLangFilter] = useState<LangFilter>('all');

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/data/processed/categories.json`)
      .then((r) => r.json())
      .then(async (cats: CategoriesData) => {
        const videos: CompactVideo[] = [];
        const seen = new Set<string>();

        for (const cat of cats.categories) {
          for (const sub of cat.subcategories) {
            if (sub.videoCount === 0) continue;
            try {
              const res = await fetch(
                `${basePath}/data/processed/videos-by-category/${sub.id}.json`
              );
              const data = await res.json();
              for (const v of data.videos) {
                if (!seen.has(v.id)) {
                  seen.add(v.id);
                  videos.push(v);
                }
              }
            } catch {
              // skip failed loads
            }
          }
        }

        setAllVideos(videos);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, langFilter]);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    let filtered = allVideos.filter(
      (v) =>
        v.t.toLowerCase().includes(q) || v.d.toLowerCase().includes(q)
    );
    if (langFilter !== 'all') {
      filtered = filtered.filter((v) => v.l === langFilter);
    }
    return filtered;
  }, [allVideos, query, langFilter]);

  const langCounts = useMemo(() => {
    const q = query.toLowerCase();
    const matched = allVideos.filter(
      (v) => v.t.toLowerCase().includes(q) || v.d.toLowerCase().includes(q)
    );
    const counts = { english: 0, telugu: 0, mixed: 0, all: matched.length };
    for (const v of matched) {
      counts[v.l]++;
    }
    return counts;
  }, [allVideos, query]);

  const totalPages = Math.ceil(results.length / VIDEOS_PER_PAGE);
  const pageVideos = results.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-border-medium">
        <div>
          <h1 className="font-heading text-[2.25rem] font-semibold text-accent-primary">
            {query ? `Search: "${query}"` : 'Search'}
          </h1>
          {query && (
            <p className="text-[0.95rem] text-text-tertiary mt-1">
              {results.length} result{results.length !== 1 ? 's' : ''} found
              {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
            </p>
          )}
        </div>

        {langCounts.all > 0 && (langCounts.english > 0 && langCounts.telugu > 0) && (
          <LanguageToggle
            value={langFilter}
            onChange={setLangFilter}
            counts={langCounts}
          />
        )}
      </div>

      {!query ? (
        <div className="text-center py-16 text-text-tertiary">
          <p className="text-lg mb-2">Enter a search term</p>
          <p className="text-sm">Use the search bar to find videos.</p>
        </div>
      ) : (
        <>
          <VideoGrid videos={pageVideos} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}
