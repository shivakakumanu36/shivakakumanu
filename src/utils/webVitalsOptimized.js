/**
 * Web Vitals Tracking Module
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 * Sends data to Google Analytics or custom endpoint
 */

import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

const VITALS_THRESHOLD = {
  LCP: 2500, // Largest Contentful Paint - 2.5s
  FID: 100,  // First Input Delay - 100ms
  CLS: 0.1,  // Cumulative Layout Shift - 0.1
  FCP: 1800, // First Contentful Paint - 1.8s
  TTFB: 600, // Time to First Byte - 600ms
};

export const initWebVitalsTracking = () => {
  // Only track in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Check if Google Analytics is available
  const isGAAvailable = typeof window !== 'undefined' && window.gtag;

  const sendVital = (metric) => {
    // Send to Google Analytics
    if (isGAAvailable) {
      window.gtag('event', 'web_vitals', {
        metric_id: metric.id,
        metric_value: Math.round(metric.value),
        metric_name: metric.name,
        metric_delta: Math.round(metric.delta),
      });
    }

    // Send to custom endpoint if configured
    if (process.env.REACT_APP_VITALS_ENDPOINT) {
      try {
        // Use sendBeacon for reliability
        navigator.sendBeacon(
          process.env.REACT_APP_VITALS_ENDPOINT,
          JSON.stringify({
            metric: metric.name,
            value: Math.round(metric.value),
            timestamp: new Date().toISOString(),
            url: window.location.href,
          })
        );
      } catch (error) {
        console.warn('Failed to send web vitals:', error);
      }
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        threshold: VITALS_THRESHOLD[metric.name],
      });
    }
  };

  // Track all metrics
  getCLS(sendVital);
  getFCP(sendVital);
  getFID(sendVital);
  getLCP(sendVital);
  getTTFB(sendVital);
};

/**
 * Get current Core Web Vitals status
 * Returns object with 'good', 'needs-improvement', 'poor' rating for each metric
 */
export const getWebVitalsStatus = async () => {
  return new Promise((resolve) => {
    const vitals = {};
    let completed = 0;

    const handleMetric = (metric) => {
      vitals[metric.name] = {
        value: Math.round(metric.value),
        rating: metric.rating,
        threshold: VITALS_THRESHOLD[metric.name],
      };
      completed++;
      if (completed === 5) {
        resolve(vitals);
      }
    };

    getCLS(handleMetric);
    getFCP(handleMetric);
    getFID(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  });
};

/**
 * Report Web Vitals metrics
 * Can be used in component for real-time monitoring
 */
export const reportWebVitals = (metric) => {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        event_callback: () => {},
      });
    }
  }
};

export default initWebVitalsTracking;
