/**
 * Data Pipeline Orchestrator
 * Runs: fetch → categorize → generate data files
 *
 * Usage:
 *   npx tsx scripts/pipeline.ts           # Full pipeline (requires YOUTUBE_API_KEY)
 *   npx tsx scripts/pipeline.ts --skip-fetch  # Skip fetch, use existing raw data
 */

import { fetchAllVideos, saveRawVideos, loadRawVideos } from './fetch-videos';
import { categorizeAllVideos } from './categorize-videos';
import { generateDataFiles } from './generate-data';

async function main() {
  const skipFetch = process.argv.includes('--skip-fetch');

  console.log('='.repeat(60));
  console.log('  Sivananda Sastry - Data Pipeline');
  console.log('='.repeat(60));

  let rawVideos;

  if (skipFetch) {
    console.log('\n[1/3] Skipping fetch, loading existing raw data...');
    rawVideos = loadRawVideos();
    console.log(`  Loaded ${rawVideos.length} videos from cache`);
  } else {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error('\nERROR: YOUTUBE_API_KEY environment variable is required.');
      console.error('Set it in .env.local or pass it directly:');
      console.error('  YOUTUBE_API_KEY=your_key npx tsx scripts/pipeline.ts');
      process.exit(1);
    }

    console.log('\n[1/3] Fetching videos from YouTube...');
    rawVideos = await fetchAllVideos(apiKey);
    saveRawVideos(rawVideos);
  }

  console.log('\n[2/3] Categorizing videos...');
  const categorized = categorizeAllVideos(rawVideos);

  console.log('\n[3/3] Generating data files...');
  generateDataFiles(categorized);

  console.log('\n' + '='.repeat(60));
  console.log('  Pipeline complete!');
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log('  npm run dev     # Start development server');
  console.log('  npm run build   # Build for production');
}

main().catch((err) => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
