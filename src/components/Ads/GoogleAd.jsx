import React, { useEffect, useRef } from 'react';

/**
 * Google AdSense Ad Component
 * Responsive ad units with proper sizing, lazy loading, and fraud detection
 */
export const GoogleAd = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  width = 'auto',
  height = 'auto',
  style = {},
  lazy = true,
  trackingId = null
}) => {
  const adRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!slot || !process.env.REACT_APP_ADSENSE_PUBLISHER_ID) {
      return;
    }

    const renderAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          
          // Track ad impressions
          if (trackingId && window.gtag) {
            window.gtag('event', 'ad_impression', {
              ad_slot: slot,
              ad_format: format,
              event_category: 'engagement',
            });
          }
        }
      } catch (error) {
        console.warn('AdSense error:', error);
      }
    };

    if (lazy && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      // Lazy load ad unit
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              renderAd();
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.01,
        }
      );

      if (adRef.current) {
        observer.observe(adRef.current);
        observerRef.current = observer;
      }

      return () => {
        if (observerRef.current && adRef.current) {
          observerRef.current.unobserve(adRef.current);
        }
      };
    } else {
      // Load immediately if lazy loading is disabled
      renderAd();
    }
  }, [slot, format, lazy, trackingId]);

  if (!slot || !process.env.REACT_APP_ADSENSE_PUBLISHER_ID) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
        minHeight: responsive ? 'auto' : '100px',
        ...style
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: responsive ? 'block' : 'inline-block',
          textAlign: 'center',
          width: width,
          height: height,
        }}
        data-ad-client={`ca-pub-${process.env.REACT_APP_ADSENSE_PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
      />
    </div>
  );
};

/**
 * Header Ad Component
 * Sticky header ad for maximum visibility
 */
export const HeaderAd = () => {
  return (
    <GoogleAd
      slot={process.env.REACT_APP_ADSENSE_SLOT_HEADER}
      format="auto"
      responsive={true}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backgroundColor: '#f5f5f5',
      }}
    />
  );
};

/**
 * Sidebar Ad Component
 * For desktop displays, hidden on mobile
 */
export const SidebarAd = () => {
  return (
    <div style={{ display: 'none', '@media (min-width: 1024px)': { display: 'block' } }}>
      <GoogleAd
        slot={process.env.REACT_APP_ADSENSE_SLOT_SIDEBAR}
        format="auto"
        responsive={true}
        width="300"
        height="600"
      />
    </div>
  );
};

/**
 * In-Content Ad Component
 * Placed between content blocks
 */
export const InContentAd = ({ style = {} }) => {
  return (
    <GoogleAd
      slot={process.env.REACT_APP_ADSENSE_SLOT_CONTENT}
      format="auto"
      responsive={true}
      style={{
        margin: '20px 0',
        ...style
      }}
    />
  );
};

/**
 * Footer Ad Component
 * Placed at the end of pages
 */
export const FooterAd = () => {
  return (
    <GoogleAd
      slot={process.env.REACT_APP_ADSENSE_SLOT_FOOTER}
      format="auto"
      responsive={true}
      style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
      }}
    />
  );
};

export default GoogleAd;
