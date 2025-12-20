/**
 * Structured Data Templates
 * JSON-LD schemas for various content types
 */

import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateProductSchema,
} from '../config/seoConfig';

/**
 * Render JSON-LD schema as HTML script tag
 */
export const renderJsonLd = (schema) => {
  if (!schema) return '';
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
};

/**
 * Blog Post Schema Component
 */
export function BlogPostSchema({ post, author, siteName, siteUrl }) {
  const schema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || post.description,
    image: post.image || `${siteUrl}/img/default-og-image.png`,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: author?.name || 'Tinasaurus',
    authorUrl: author?.url || siteUrl,
    url: `${siteUrl}/blog/${post.slug}`,
    content: post.content,
    keywords: post.tags || [],
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Documentation Page Schema
 */
export function DocPageSchema({ title, description, url, breadcrumbs = [] }) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      url: url,
      mainEntity: {
        "@type": "Article",
        headline: title,
        description: description,
      },
    },
  ];

  if (breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/**
 * FAQ Schema Component
 */
export function FAQSchema({ faqs }) {
  const schema = generateFAQSchema(faqs);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization Schema Component
 */
export function OrganizationSchema({ config }) {
  const schema = generateOrganizationSchema(config);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb Schema Component
 */
export function BreadcrumbSchema({ breadcrumbs }) {
  const schema = generateBreadcrumbSchema(breadcrumbs);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * How-to Schema Template
 */
export const HowToSchema = (howTo) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: howTo.title,
  description: howTo.description,
  image: howTo.image || "",
  totalTime: howTo.totalTime,
  estimatedCost: howTo.estimatedCost,
  step: howTo.steps.map((step, idx) => ({
    "@type": "HowToStep",
    position: idx + 1,
    name: step.title,
    text: step.description,
    image: step.image,
    url: `${howTo.url}#step-${idx + 1}`,
  })),
  tool: howTo.tools || [],
  supply: howTo.supplies || [],
});

/**
 * Video Schema Template
 */
export const VideoSchema = (video) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.title,
  description: video.description,
  thumbnailUrl: video.thumbnail,
  uploadDate: video.uploadDate,
  duration: video.duration,
  contentUrl: video.url,
  embedUrl: video.embedUrl,
  interactionStatistic: {
    "@type": "InteractionCounter",
    interactionType: "http://schema.org/WatchAction",
    userInteractionCount: video.views || 0,
  },
});

/**
 * Recipes Schema Template
 */
export const RecipeSchema = (recipe) => ({
  "@context": "https://schema.org",
  "@type": "Recipe",
  name: recipe.title,
  description: recipe.description,
  image: recipe.image,
  author: {
    "@type": "Person",
    name: recipe.author,
  },
  prepTime: recipe.prepTime,
  cookTime: recipe.cookTime,
  totalTime: recipe.totalTime,
  recipeYield: recipe.yield,
  recipeCategory: recipe.category,
  recipeCuisine: recipe.cuisine,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions.map((inst, idx) => ({
    "@type": "HowToStep",
    position: idx + 1,
    text: inst,
  })),
  aggregateRating: recipe.rating && {
    "@type": "AggregateRating",
    ratingValue: recipe.rating.value,
    reviewCount: recipe.rating.count,
  },
});

/**
 * Event Schema Template
 */
export const EventSchema = (event) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.title,
  description: event.description,
  startDate: event.startDate,
  endDate: event.endDate,
  eventAttendanceMode: event.attendanceMode || "OfflineEventAttendanceMode",
  eventStatus: event.status || "EventScheduled",
  location: {
    "@type": "Place",
    name: event.location,
    address: event.address,
  },
  image: event.image,
  offers: {
    "@type": "Offer",
    url: event.url,
    price: event.price,
    priceCurrency: event.currency || "USD",
    availability: event.availability || "InStock",
  },
  organizer: {
    "@type": "Organization",
    name: event.organizer,
    url: event.organizerUrl,
  },
});

/**
 * LocalBusiness Schema Template
 */
export const LocalBusinessSchema = (business) => ({
  "@context": "https://schema.org",
  "@type": business.type || "LocalBusiness",
  name: business.name,
  description: business.description,
  image: business.image,
  url: business.url,
  telephone: business.phone,
  email: business.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.zip,
    addressCountry: business.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: business.latitude,
    longitude: business.longitude,
  },
  openingHoursSpecification: business.hours?.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens: h.opens,
    closes: h.closes,
  })),
  aggregateRating: business.rating && {
    "@type": "AggregateRating",
    ratingValue: business.rating.value,
    reviewCount: business.rating.count,
  },
  sameAs: business.social || [],
});

export default {
  renderJsonLd,
  BlogPostSchema,
  DocPageSchema,
  FAQSchema,
  OrganizationSchema,
  BreadcrumbSchema,
  HowToSchema,
  VideoSchema,
  RecipeSchema,
  EventSchema,
  LocalBusinessSchema,
};
