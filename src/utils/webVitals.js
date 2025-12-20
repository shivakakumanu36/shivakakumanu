/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and sends them to analytics
 */

export const onCLS = (metric) => {
  console.log("CLS (Cumulative Layout Shift):", metric.value);
  // Send to analytics service
  if (window.gtag) {
    window.gtag("event", "page_view", {
      event_category: "engagement",
      event_label: "CLS",
      value: metric.value,
      event_callback: () => {},
    });
  }
};

export const onFID = (metric) => {
  console.log("FID (First Input Delay):", metric.value);
  // Send to analytics service
  if (window.gtag) {
    window.gtag("event", "page_view", {
      event_category: "engagement",
      event_label: "FID",
      value: metric.value,
      event_callback: () => {},
    });
  }
};

export const onLCP = (metric) => {
  console.log("LCP (Largest Contentful Paint):", metric.value);
  // Send to analytics service
  if (window.gtag) {
    window.gtag("event", "page_view", {
      event_category: "engagement",
      event_label: "LCP",
      value: metric.value,
      event_callback: () => {},
    });
  }
};

export const onFCP = (metric) => {
  console.log("FCP (First Contentful Paint):", metric.value);
};

export const onTTFB = (metric) => {
  console.log("TTFB (Time to First Byte):", metric.value);
};

/**
 * Initialize Web Vitals tracking
 */
export const initWebVitals = () => {
  if (typeof window !== "undefined") {
    import("web-vitals").then((webVitals) => {
      webVitals.getCLS(onCLS);
      webVitals.getFID(onFID);
      webVitals.getFCP(onFCP);
      webVitals.getLCP(onLCP);
      webVitals.getTTFB(onTTFB);
    });
  }
};
