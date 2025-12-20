import React, { useState, useEffect } from 'react';

/**
 * Optimized Image Component
 * - Lazy loading with IntersectionObserver
 * - Responsive images with srcSet
 * - WebP format support with fallback
 * - Placeholder blur effect
 */
export const OptimizedImage = ({
  src,
  alt,
  title,
  width,
  height,
  className = '',
  style = {},
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    // Use IntersectionObserver for lazy loading
    if (!priority && typeof window !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before visible
        }
      );

      if (imageRef) {
        observer.observe(imageRef);
      }

      return () => {
        if (imageRef) {
          observer.unobserve(imageRef);
        }
      };
    }
  }, [src, imageRef, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    if (onError) onError();
  };

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      style={{
        opacity: isLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease-in-out',
        ...style,
      }}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );
};

/**
 * Responsive Picture Component
 * Supports WebP with fallback and responsive images
 */
export const ResponsiveImage = ({
  src,
  alt,
  title,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw',
  className = '',
  style = {},
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    if (!priority && typeof window !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const picture = entry.target;
              const img = picture.querySelector('img');
              if (img && img.dataset.src) {
                img.src = img.dataset.src;
                if (img.srcset) img.srcset = img.dataset.srcset;
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '50px' }
      );

      if (imageRef) {
        observer.observe(imageRef);
      }

      return () => {
        if (imageRef) {
          observer.unobserve(imageRef);
        }
      };
    }
  }, [imageRef, priority]);

  // Generate responsive image URLs (assumes image service or CDN)
  const generateSrcSet = (imageSrc) => {
    // Example: if using a CDN like Cloudinary or similar
    return imageSrc;
  };

  return (
    <picture ref={setImageRef} style={{ display: 'block' }}>
      {/* WebP format */}
      <source
        srcSet={`${src.replace(/\.([^.]+)$/, '.webp')} 1x, ${src.replace(/\.([^.]+)$/, '@2x.webp')} 2x`}
        type="image/webp"
      />
      {/* Fallback format */}
      <source
        srcSet={`${src} 1x, ${src.replace(/\.([^.]+)$/, '@2x.$1')} 2x`}
        type={`image/${src.split('.').pop()}`}
      />
      <img
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        sizes={sizes}
        className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          opacity: isLoaded ? 1 : 0.7,
          transition: 'opacity 0.3s ease-in-out',
          ...style,
        }}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};

export default OptimizedImage;
