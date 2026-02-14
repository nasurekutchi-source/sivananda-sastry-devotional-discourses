import * as fs from 'fs';
import * as path from 'path';
import SubcategoryClient from './SubcategoryClient';

interface CategoryData {
  id: string;
  videoCount: number;
  subcategories: { id: string; slug: string; videoCount: number }[];
}

export function generateStaticParams() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'processed', 'categories.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);
    const params: { category: string; subcategory: string }[] = [];

    for (const cat of data.categories as CategoryData[]) {
      if (cat.videoCount === 0) continue;
      for (const sub of cat.subcategories) {
        if (sub.videoCount === 0) continue;
        params.push({ category: cat.id, subcategory: sub.id });
      }
    }

    return params;
  } catch {
    return [];
  }
}

export default function SubcategoryPage() {
  return <SubcategoryClient />;
}
