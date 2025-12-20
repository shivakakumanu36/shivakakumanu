/**
 * Build Optimization Configuration
 * - Asset compression
 * - Bundle splitting
 * - Minification settings
 * - Output optimization
 */

module.exports = {
  /**
   * Compression settings
   */
  compression: {
    algorithm: 'gzip', // or 'brotli'
    level: 9, // 1-11 for brotli, 1-9 for gzip
    minSize: 1024, // Only compress files > 1KB
    exclude: /\.(woff2|jpg|jpeg|png|gif|ico)$/i, // Don't compress these
    filename: '[path][base].gz',
    test: /\.(js|css|html|svg|json)$/i,
  },

  /**
   * Image optimization
   */
  images: {
    formats: ['image/webp', 'image/avif'],
    disableStaticImages: false,
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    sizes: [320, 640, 960, 1280, 1920],
    quality: 85,
  },

  /**
   * Font optimization
   */
  fonts: {
    preload: [
      '/fonts/inter-var.woff2',
      '/fonts/system-ui.woff2',
    ],
    subsetting: true,
    display: 'swap', // Show fallback immediately
  },

  /**
   * CSS optimization
   */
  css: {
    minify: true,
    removeUnusedRules: true,
    purge: {
      enabled: true,
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './docusaurus.config.js',
      ],
    },
    critical: {
      enabled: true,
      minSize: 1024,
      maxSize: 40960,
    },
  },

  /**
   * JavaScript optimization
   */
  javascript: {
    minify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    codeSplitting: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: 'common',
        },
        ui: {
          test: /[\\/]src[\\/]components[\\/]/,
          name: 'ui',
          priority: 15,
          reuseExistingChunk: true,
        },
        pages: {
          test: /[\\/]src[\\/]pages[\\/]/,
          name: 'pages',
          priority: 15,
          reuseExistingChunk: true,
        },
      },
    },
  },

  /**
   * HTML optimization
   */
  html: {
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    },
    precompress: true,
  },

  /**
   * Bundle analysis
   */
  bundleAnalysis: {
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: true,
    reportFilename: 'bundle-report.html',
    defaultSizes: 'gzip',
  },

  /**
   * Cache busting
   */
  caching: {
    static: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    dynamic: {
      maxAge: 3600, // 1 hour
      sMaxAge: 86400, // 24 hours (for CDN)
    },
    html: {
      maxAge: 0,
      mustRevalidate: true,
    },
  },

  /**
   * Network optimization
   */
  network: {
    preloadCriticalResources: true,
    dnsPrefetch: [
      'https://www.youtube.com',
      'https://www.googletagmanager.com',
      'https://pagead2.googlesyndication.com',
    ],
    preconnect: [
      'https://www.youtube.com',
      'https://www.google-analytics.com',
    ],
  },

  /**
   * Performance budgets
   */
  performanceBudgets: {
    bundles: [
      {
        name: 'main',
        maxSize: '250kb',
      },
      {
        name: 'vendor',
        maxSize: '300kb',
      },
      {
        name: 'ui',
        maxSize: '100kb',
      },
    ],
    metrics: {
      LCP: 2500, // ms
      FID: 100,  // ms
      CLS: 0.1,  // score
      FCP: 1800, // ms
      TTFB: 600, // ms
    },
  },

  /**
   * Lazy loading configuration
   */
  lazyLoading: {
    images: true,
    components: true,
    threshold: 0.1,
    rootMargin: '50px',
  },

  /**
   * Service worker configuration
   */
  serviceWorker: {
    enabled: true,
    skipWaiting: true,
    clientsClaim: true,
    offlineRoute: '/offline.html',
  },
};

module.exports.getCompressionConfig = (algorithm = 'gzip') => {
  if (algorithm === 'brotli') {
    return {
      algorithm: 'br',
      level: 11,
      removeOriginalAssets: true,
    };
  }
  return {
    algorithm: 'gzip',
    level: 9,
    removeOriginalAssets: false, // Keep gzip as fallback
  };
};

/**
 * Get appropriate CSP header
 */
module.exports.getCSPHeader = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://pagead2.googlesyndication.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.youtube.com https://www.google-analytics.com https://pagead2.googlesyndication.com",
      "media-src 'self' https://www.youtube.com",
      "frame-src https://www.youtube.com",
    ].join('; '),
  };
};

/**
 * Get security headers
 */
module.exports.getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
});
