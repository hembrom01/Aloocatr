
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Rule for static assets in _next/static
        // These are fingerprinted, so they can be cached for a long time.
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Rule for API routes
        // These should generally not be cached by intermediaries or browsers.
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Rule for other paths, which are assumed to be HTML pages.
        // This needs to come after specific rules like /_next/static and /api.
        // The pattern tries to match page routes while excluding common static/API patterns.
        source: '/:path((?!api/|_next/static/|_next/image/|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
       // Ensure the root path '/' also gets the page caching headers
      {
        source: '/',
        headers: [
           {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      }
    ];
  },
};

export default nextConfig;
