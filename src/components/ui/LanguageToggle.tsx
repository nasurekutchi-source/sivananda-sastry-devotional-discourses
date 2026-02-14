'use client';

import type { Language } from '@/lib/types';

type FilterValue = Language | 'all';

interface LanguageToggleProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  counts?: { english: number; telugu: number; mixed: number; all: number };
}

const OPTIONS: { value: FilterValue; label: string; short: string }[] = [
  { value: 'all', label: 'All', short: 'All' },
  { value: 'english', label: 'English', short: 'EN' },
  { value: 'telugu', label: 'Telugu', short: 'TE' },
];

export function LanguageToggle({ value, onChange, counts }: LanguageToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-brand-700 overflow-hidden">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        const count = counts?.[opt.value === 'all' ? 'all' : opt.value];

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-brand-300 text-brand-950'
                : 'bg-brand-900 text-brand-400 hover:bg-brand-800'
            }`}
          >
            <span className="hidden sm:inline">{opt.label}</span>
            <span className="sm:hidden">{opt.short}</span>
            {count !== undefined && (
              <span className={`ml-1 ${isActive ? 'text-brand-700' : 'text-brand-600'}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
