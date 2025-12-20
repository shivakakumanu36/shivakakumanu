/**
 * usePageOptimization Hook
 * Initializes all performance, SEO, and ad optimizations
 */

import { useEffect } from 'react';
import { initWebVitalsTracking } from '../utils/webVitalsOptimized';
import {
  registerServiceWorker,
  preconnect,
  prefetchDns,
} from '../utils/performanceOptimization';

export const usePageOptimization = () => {
  useEffect(() => {
    // Initialize Web Vitals tracking
    if (process.env.NODE_ENV === 'production') {
      initWebVitalsTracking();
    }

    // Preconnect to external domains for faster loading
    preconnect('https://www.google-analytics.com');
    preconnect('https://www.youtube.com');
    preconnect('https://pagead2.googlesyndication.com');

    // DNS prefetch for external resources
    prefetchDns('www.youtube.com');
    prefetchDns('img.youtube.com');
    prefetchDns('www.google-analytics.com');

    // Register service worker for offline support
    if (process.env.ENABLE_SERVICE_WORKER !== 'false') {
      registerServiceWorker();
    }
  }, []);
};

export default usePageOptimization;
