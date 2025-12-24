const docusaurusData = require("./config/docusaurus/index.json");

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

const getDocId = (doc) => {
  return doc
    .replace(/\.mdx?$/, "")
    .split("/")
    .slice(1)
    .join("/");
};

const getPageRoute = (page) => {
  return page
    .replace(/\.mdx?$/, "")
    .split("/")
    .slice(2)
    .join("/");
};

const getPath = (page) => {
  return page.replace(/\.mdx?$/, "");
};

const formatFooterItem = (item) => {
  if (item.title) {
    return {
      title: item.title,
      items: item.items.map((subItem) => {
        return formatFooterItem(subItem);
      }),
    };
  } else {
    let linkObject = {
      label: item.label,
    };

    if (item.to) {
      linkObject.to = getPath(item.to);
    } else if (item.href) {
      linkObject.href = item.href;
    } else {
      linkObject.to = "/blog";
    }

    return linkObject;
  }
};

const formatNavbarItem = (item, subnav = false) => {
  let navItem = {
    label: item.label,
  };

  if (!subnav) {
    navItem.position = item.position;
  }

  if (item.className) {
    navItem.className = item.className;
  }

  if (item.ariaLabel) {
    navItem.ariaLabel = item.ariaLabel;
  }

  if (item.link === "external" && item.externalLink) {
    navItem.href = item.externalLink;
  }

  if (item.link === "blog") {
    navItem.to = "/blog";
  }

  if (item.link === "page" && item.pageLink) {
    navItem.to = getPageRoute(item.pageLink);
  }

  if (item.link === "doc" && item.docLink) {
    navItem.type = "doc";
    navItem.docId = getDocId(item.docLink);
  }

  if (item.items) {
    navItem.type = "dropdown";
    navItem.items = item.items.map((subItem) => {
      return formatNavbarItem(subItem, true);
    });
  }

  return navItem;
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: docusaurusData.title || "My Site",
  tagline: docusaurusData.tagline || "Dinosaurs are cool",
  url: docusaurusData.url || "https://shivakakumanu.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  
  // SEO Configuration
  noIndex: false,
  
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Custom fields for performance configuration
  customFields: {
    performanceOptimizations: {
      experimental_faster: true,
    },
    siteDescription: docusaurusData.description || "Build better content sites faster with Docusaurus and TinaCMS",
    socialImage: "/img/social-image.png",
    twitterHandle: "@tinacms",
    organizationName: "ShivaKakumanu",
    organizationUrl: docusaurusData.url,
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || "",
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
    adSensePublisherId: process.env.ADSENSE_PUBLISHER_ID || "",
  },

  headTags: [
    // DNS prefetch for external resources
    {
      tagName: "link",
      attributes: {
        rel: "dns-prefetch",
        href: "https://www.youtube.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "dns-prefetch",
        href: "https://img.youtube.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "dns-prefetch",
        href: "https://www.googletagmanager.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "dns-prefetch",
        href: "https://pagead2.googlesyndication.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "dns-prefetch",
        href: "https://googleads.g.doubleclick.net",
      },
    },
    // Preconnect to YouTube for faster video loading
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://www.youtube.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://img.youtube.com",
      },
    },
    // Preconnect to Google Analytics
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://www.google-analytics.com",
      },
    },
    // Preconnect to AdSense
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://pagead2.googlesyndication.com",
      },
    },
    // Preload critical fonts and resources
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        as: "font",
        href: "/fonts/system-ui.woff2",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    },
    // Meta tags for performance
    {
      tagName: "meta",
      attributes: {
        httpEquiv: "x-ua-compatible",
        content: "ie=edge",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
      },
    },
    // Format Detection
    {
      tagName: "meta",
      attributes: {
        name: "format-detection",
        content: "telephone=no",
      },
    },
    // Enable compression
    {
      tagName: "meta",
      attributes: {
        httpEquiv: "Content-Encoding",
        content: "gzip, deflate, br",
      },
    },
    // Cache control headers (note: headers should be set in server config, but this is a hint)
    {
      tagName: "meta",
      attributes: {
        httpEquiv: "Cache-Control",
        content: "public, max-age=3600, must-revalidate",
      },
    },
    // Google Site Verification (add only if env var is set)
    ...(process.env.GOOGLE_SITE_VERIFICATION ? [{
      tagName: "meta",
      attributes: {
        name: "google-site-verification",
        content: process.env.GOOGLE_SITE_VERIFICATION,
      },
    }] : []),
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: docusaurusData.url + "/admin/#/collections/doc",
        },
        blog: {
          showReadingTime: true,
          editUrl: docusaurusData.url + "/admin/#/collections/post",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // SEO and social metadata
      metadata: [
        {
          name: "description",
          content: docusaurusData.description || "Build better content sites faster with Docusaurus and TinaCMS",
        },
        {
          name: "keywords",
          content: "docusaurus, tinacms, documentation, blog, static site generator, cms, headless",
        },
        {
          name: "author",
          content: "ShivaKakumanu",
        },
        {
          name: "robots",
          content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
        },
        // Open Graph Tags
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: docusaurusData.url,
        },
        {
          property: "og:title",
          content: docusaurusData.title || "ShivaKakumanu",
        },
        {
          property: "og:description",
          content: docusaurusData.description || "Build better content sites faster",
        },
        {
          property: "og:image",
          content: docusaurusData.url + "/img/social-image.png",
        },
        {
          property: "og:site_name",
          content: docusaurusData.title || "ShivaKakumanu",
        },
        {
          property: "og:locale",
          content: "en_US",
        },
        // Twitter Card Tags
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: docusaurusData.url,
        },
        {
          name: "twitter:title",
          content: docusaurusData.title || "ShivaKakumanu",
        },
        {
          name: "twitter:description",
          content: docusaurusData.description || "Build better content sites faster",
        },
        {
          name: "twitter:image",
          content: docusaurusData.url + "/img/social-image.png",
        },
        // Schema.org Structured Data - Organization
        {
          itemProp: "name",
          content: docusaurusData.title || "ShivaKakumanu",
        },
        {
          itemProp: "description",
          content: docusaurusData.description || "Build better content sites faster with Docusaurus and TinaCMS",
        },
        {
          itemProp: "image",
          content: docusaurusData.url + "/img/social-image.png",
        },
        // Performance and PWA
        {
          name: "theme-color",
          content: "#16a34a",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
      ],
      navbar: {
        title: docusaurusData.title || "",
        items: docusaurusData.navbar.map((item) => {
          return formatNavbarItem(item);
        }),
      },
      footer: {
        style: docusaurusData.footer?.style || "dark",
        links: docusaurusData.footer?.links.map((item) => {
          return formatFooterItem(item);
        }),
        copyright: docusaurusData.footer?.copyright || docusaurusData.title,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
      // Algolia search configuration (optional)
      // search: {
      //   appId: process.env.ALGOLIA_APP_ID || "",
      //   apiKey: process.env.ALGOLIA_API_KEY || "",
      //   indexName: process.env.ALGOLIA_INDEX_NAME || "shivakakumanu",
      // },
    }),
};

module.exports = config;
