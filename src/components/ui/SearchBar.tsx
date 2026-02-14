'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/search/?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search teachings..."
        className="w-full px-4 py-2.5 pr-10 bg-bg-tertiary border border-border-medium rounded
                   text-text-primary text-[0.95rem] font-body
                   placeholder-text-tertiary
                   focus:outline-none focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(139,90,60,0.1)]
                   transition-all duration-300"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-secondary pointer-events-none text-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </form>
  );
}
