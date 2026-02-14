export type Language = 'english' | 'telugu' | 'mixed';

export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  language: Language;
  categories: string[];
}

/** Compact video format used in split JSON files to minimize file size */
export interface CompactVideo {
  id: string;
  t: string;   // title
  d: string;   // description (truncated)
  p: string;   // publishedAt (YYYY-MM-DD)
  th: string;  // thumbnail URL
  l: Language;  // language
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  videoCount: number;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  videoCount: number;
  subcategories: Subcategory[];
}

export interface CategoriesData {
  categories: Category[];
  totalVideos: number;
  lastUpdated: string;
  languageCounts: {
    english: number;
    telugu: number;
    mixed: number;
  };
}

export interface StatsData {
  totalVideos: number;
  totalCategories: number;
  totalSubcategories: number;
  languageCounts: {
    english: number;
    telugu: number;
    mixed: number;
  };
  lastUpdated: string;
  channelUrl: string;
}

export interface SubcategoryDataFile {
  subcategoryId: string;
  categoryId: string;
  videos: CompactVideo[];
}
