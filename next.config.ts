import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Only use static export for production builds (GitHub Pages)
  // Dev mode needs SSR to work without generateStaticParams
  ...(isProd ? { output: 'export' } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
