'use client';

import type { Language } from '@/lib/types';

type FilterValue = Language | 'all';

interface LanguageToggleProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  counts?: { english: number; telugu: number; mixed: number; all: number };
}

const OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'english', label: 'English' },
  { value: 'telugu', label: 'Telugu' },
];

export function LanguageToggle({ value, onChange, counts }: LanguageToggleProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        const count = counts?.[opt.value === 'all' ? 'all' : opt.value];

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`filter-btn ${isActive ? 'filter-btn-active' : ''}`}
          >
            {opt.label}
            {count !== undefined && (
              <span className={`ml-1.5 ${isActive ? 'text-white/70' : 'text-text-tertiary'}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
