/**
 * SEO Configuration
 * - Structured Data (JSON-LD)
 * - Meta tags management
 * - Open Graph configuration
 * - Canonical URLs
 */

export const generateOrganizationSchema = (config) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.title || "ShivaKakumanu",
    description: config.description || "Build better content sites faster with Docusaurus and TinaCMS",
    url: config.url,
    logo: `${config.url}/img/logo.svg`,
    sameAs: [
      "https://twitter.com/tinacms",
      "https://github.com/tinacms",
      "https://www.linkedin.com/company/tinacms",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: `${config.url}/contact`,
    },
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.url,
    })),
  };
};

export const generateArticleSchema = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description || article.excerpt,
    image: article.image || "/img/default-og-image.png",
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author || "ShivaKakumanu",
      url: article.authorUrl || "#",
    },
    publisher: {
      "@type": "Organization",
      name: "ShivaKakumanu",
      logo: {
        "@type": "ImageObject",
        url: "/img/logo.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    articlebody: article.content,
    keywords: article.keywords?.join(", ") || "",
  };
};

export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateProductSchema = (product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.brand || "ShivaKakumanu",
    },
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: product.currency || "USD",
      price: product.price,
      availability: product.availability || "InStock",
    },
    aggregateRating: product.rating && {
      "@type": "AggregateRating",
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
    },
  };
};

export const generateSitemapEntry = (url, options = {}) => {
  return {
    url,
    lastmod: options.lastmod || new Date().toISOString(),
    changefreq: options.changefreq || "weekly",
    priority: options.priority || 0.8,
  };
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Allow: /blog/
Allow: /docs/
Allow: /admin/

Disallow: /admin/
Disallow: /*.json$
Disallow: /*?*
Disallow: *?preview=*

User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 1

Sitemap: https://shivakakumanu.com/sitemap.xml
Sitemap: https://shivakakumanu.com/sitemap-blog.xml

# Performance directives
Request-rate: 30/60 (requests per 60 seconds)
`;
};

export const seoConfig = {
  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocales: ["en_GB", "en_AU"],
  },

  // Twitter Card defaults
  twitter: {
    handle: "@tinacms",
    site: "@tinacms",
    cardType: "summary_large_image",
  },

  // Meta tags for common pages
  defaultMeta: {
    charset: "utf-8",
    httpEquiv: "x-ua-compatible",
    content: "ie=edge",
  },

  // Canonical URL configuration
  canonical: {
    enforceTrailingSlash: false,
    includeProtocol: true,
  },

  // JSON-LD configuration
  jsonLd: {
    organization: true,
    breadcrumbs: true,
    articles: true,
  },

  // Mobile optimization
  mobile: {
    appLinks: true,
    alternateUrls: false,
    preferredVersion: "mobile",
  },

  // Performance hints
  performance: {
    preloadCriticalResources: true,
    dnsPrefetch: [
      "https://www.youtube.com",
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
    ],
    preconnect: [
      "https://www.youtube.com",
      "https://www.google-analytics.com",
    ],
  },

  // Security headers recommendations
  securityHeaders: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },

  // Cache directives
  cacheControl: {
    public: "public, max-age=3600, s-maxage=86400",
    static: "public, max-age=31536000, immutable",
    dynamic: "public, max-age=60, s-maxage=3600",
  },
};

export default seoConfig;
