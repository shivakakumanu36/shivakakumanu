/**
 * Advanced Performance Monitoring
 * - Core Web Vitals tracking
 * - Error tracking and reporting
 * - Analytics integration
 * - Performance metrics collection
 */

export class PerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      trackWebVitals: true,
      trackErrors: true,
      trackNetworkInfo: true,
      trackUserTiming: true,
      enableBeacon: true,
      ...config,
    };
    this.metrics = {};
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (typeof window === 'undefined') return;

    if (this.config.trackWebVitals) {
      this.trackWebVitals();
    }

    if (this.config.trackErrors) {
      this.trackErrors();
    }

    if (this.config.trackNetworkInfo) {
      this.trackNetworkInfo();
    }

    if (this.config.trackUserTiming) {
      this.trackUserTiming();
    }

    // Send metrics on page unload
    window.addEventListener('beforeunload', () => {
      this.sendMetrics();
    });

    // Also send metrics periodically
    setInterval(() => {
      this.sendMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observation failed:', e);
      }

      // First Input Delay (FID) / Interaction to Next Paint (INP)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric('FID', entry.processingDuration);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observation failed:', e);
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      try {
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.recordMetric('CLS', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observation failed:', e);
      }
    }

    // Additional metrics
    if ('PerformanceTiming' in window) {
      window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const paint = performance.getEntriesByType('paint');

        // First Contentful Paint
        const fcp = paint.find((p) => p.name === 'first-contentful-paint');
        if (fcp) {
          this.recordMetric('FCP', fcp.startTime);
        }

        // Time to First Byte
        const ttfb = timing.responseStart - timing.navigationStart;
        this.recordMetric('TTFB', ttfb);

        // DOM Interactive
        const domInteractive = timing.domInteractive - timing.navigationStart;
        this.recordMetric('DOM_Interactive', domInteractive);

        // Load Complete
        const loadComplete = timing.loadEventEnd - timing.navigationStart;
        this.recordMetric('Load_Complete', loadComplete);

        // Total Page Load Time
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        this.recordMetric('Page_Load_Time', pageLoadTime);
      });
    }
  }

  /**
   * Track JavaScript errors
   */
  trackErrors() {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Unhandled Promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'unhandled_promise',
        reason: event.reason?.message || event.reason,
        stack: event.reason?.stack,
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.recordError({
          type: 'resource_error',
          resource: event.target.src || event.target.href,
          tagName: event.target.tagName,
        });
      }
    }, true);
  }

  /**
   * Track network information
   */
  trackNetworkInfo() {
    if (typeof window === 'undefined' || !('connection' in navigator)) {
      return;
    }

    const connection = navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection) {
      const info = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };

      this.recordMetric('Network_Info', info);

      // Listen for changes
      connection.addEventListener('change', () => {
        this.recordMetric('Network_Change', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        });
      });
    }
  }

  /**
   * Track user timing markers
   */
  trackUserTiming() {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    // Record custom marks
    window.performanceMark = (name) => {
      if (performance.mark) {
        performance.mark(name);
      }
    };

    // Record custom measures
    window.performanceMeasure = (name, startMark, endMark) => {
      if (performance.measure) {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        this.recordMetric(`User_Timing_${name}`, measure.duration);
      }
    };
  }

  /**
   * Record a metric
   */
  recordMetric(name, value) {
    this.metrics[name] = value;

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: typeof value === 'object' ? JSON.stringify(value) : value,
        event_category: 'performance',
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}:`, value);
    }
  }

  /**
   * Record an error
   */
  recordError(error) {
    // Send to error tracking service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || error.type,
        fatal: false,
        error_category: error.type,
      });
    }

    // Send to external error tracking (e.g., Sentry)
    if (window.errorTracker && window.errorTracker.captureException) {
      window.errorTracker.captureException(error);
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Recorded Error:', error);
    }
  }

  /**
   * Send metrics to analytics
   */
  sendMetrics() {
    if (typeof window === 'undefined' || !this.config.enableBeacon) {
      return;
    }

    const data = JSON.stringify({
      metrics: this.metrics,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/metrics', data);
    }
  }

  /**
   * Get collected metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.metrics = {};
  }
}

/**
 * Hook for using performance monitor in React components
 */
export const usePerformanceMonitor = (config = {}) => {
  React.useEffect(() => {
    const monitor = new PerformanceMonitor(config);
    return () => {
      monitor.sendMetrics();
    };
  }, [config]);
};

// Initialize monitoring globally
if (typeof window !== 'undefined') {
  window.performanceMonitor = new PerformanceMonitor();
}

export default PerformanceMonitor;
