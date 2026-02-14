import * as fs from 'fs';
import * as path from 'path';
import CategoryClient from './CategoryClient';

export function generateStaticParams() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'processed', 'categories.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);
    return data.categories
      .filter((c: { videoCount: number }) => c.videoCount > 0)
      .map((c: { id: string }) => ({ category: c.id }));
  } catch {
    return [];
  }
}

export default function CategoryPage() {
  return <CategoryClient />;
}
