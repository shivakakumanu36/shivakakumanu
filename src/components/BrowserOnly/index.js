/**
 * BrowserOnly wrapper for performance monitoring
 * Delays execution until browser is ready
 */

import { useEffect, useState } from "react";

export function useBrowserOnly() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser;
}

export function BrowserOnly({ children, fallback = null }) {
  const isBrowser = useBrowserOnly();

  if (!isBrowser) {
    return fallback;
  }

  return children;
}
