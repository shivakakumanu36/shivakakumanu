/**
 * Performance Optimization Utilities
 * - Bundle size analysis
 * - Code splitting helpers
 * - Caching strategies
 * - Network optimization
 */

/**
 * Defer non-critical script loading
 * Loads scripts after main content is rendered
 */
export const deferScript = (src, attributes = {}) => {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  
  // Add custom attributes
  Object.keys(attributes).forEach((key) => {
    script.setAttribute(key, attributes[key]);
  });

  document.body.appendChild(script);
};

/**
 * Preload critical resources
 */
export const preloadResource = (href, as = 'script', type = null) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (type) {
    link.type = type;
  }

  document.head.appendChild(link);
};

/**
 * Implement aggressive caching strategy
 * Stores data in localStorage with TTL
 */
export class CacheManager {
  constructor(prefix = 'cache_', ttl = 3600000) {
    this.prefix = prefix;
    this.ttl = ttl; // Default 1 hour
  }

  set(key, value, ttl = this.ttl) {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const item = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Cache write failed:', error);
    }
  }

  get(key) {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const item = JSON.parse(localStorage.getItem(this.prefix + key));
      
      if (!item) return null;

      // Check if cache has expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Cache read failed:', error);
      return null;
    }
  }

  remove(key) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.removeItem(this.prefix + key);
  }

  clear() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * Implement request debouncing and throttling
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit = 300) => {
  let lastCall = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Connection-aware resource loading
 * Loads high-quality resources on fast connections, low-quality on slow ones
 */
export const getOptimalImageQuality = () => {
  if (typeof window === 'undefined') return 'medium';

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return 'high';

  const effectiveType = connection.effectiveType; // 4g, 3g, 2g, slow-2g

  switch (effectiveType) {
    case '4g':
      return 'high';
    case '3g':
      return 'medium';
    case '2g':
    case 'slow-2g':
      return 'low';
    default:
      return 'medium';
  }
};

/**
 * Prefetch DNS for external resources
 */
export const prefetchDns = (hostname) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = `//​${hostname}`;
  document.head.appendChild(link);
};

/**
 * Preconnect to external origins
 */
export const preconnect = (origin) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Monitor network information
 */
export const getNetworkInfo = () => {
  if (typeof navigator === 'undefined') return null;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return null;

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
};

/**
 * Detect if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Service Worker registration for offline support
 */
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.warn('Service Worker registration failed:', error);
      });
  });
};

export default {
  deferScript,
  preloadResource,
  CacheManager,
  debounce,
  throttle,
  getOptimalImageQuality,
  prefetchDns,
  preconnect,
  getNetworkInfo,
  prefersReducedMotion,
  registerServiceWorker,
};
