/**
 * Performance Optimization Configuration
 * Contains settings for optimizing page load performance
 */

export const performanceConfig = {
  // Lazy loading settings
  lazyLoading: {
    youtube: true,
    images: true,
    components: true,
  },

  // Code splitting settings
  codeSplitting: {
    enabled: true,
    chunks: ["vendor", "common", "main"],
  },

  // Caching settings
  caching: {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 86400, // 24 hours
  },

  // Resource hints
  resourceHints: {
    dns_prefetch: [
      "https://www.youtube.com",
      "https://img.youtube.com",
      "https://fonts.googleapis.com",
    ],
    preconnect: ["https://www.youtube.com"],
    prefetch: ["https://www.youtube.com/s/player/abc123/player_ias.vflset/en_US/base.js"],
  },

  // Compression settings
  compression: {
    enabled: true,
    algorithm: "brotli", // or "gzip"
    level: 11,
  },

  // Web Vitals thresholds
  webVitalsThresholds: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100, // First Input Delay (ms)
    CLS: 0.1, // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 600, // Time to First Byte (ms)
  },

  // Bundle size limits
  bundleSize: {
    main: "250kb",
    vendor: "300kb",
    common: "100kb",
  },

  // Feature flags
  features: {
    serviceWorker: true,
    preloadCriticalAssets: true,
    deferNonCriticalCSS: true,
    minifyHTML: true,
    stripDebugCode: true,
  },
};

export default performanceConfig;
