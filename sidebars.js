const fs = require("fs");
const path = require("path");

const sidebarData = require("./config/sidebar/index.json");

const docExists = (doc) => {
  if (!doc) {
    return false;
  }
  // Skip sidebar entries whose documents are missing to avoid Docusaurus build errors.
  return fs.existsSync(path.join(__dirname, doc));
};

const getDocId = (doc) => {
  return doc
    .replace(/\.mdx?$/, "")
    .split("/")
    .slice(1)
    .join("/");
};

const getIconForCategoryLabel = (label) => {
  const normalized = String(label || "").toLowerCase();
  if (normalized.includes("tutorial") && normalized.includes("basics")) {
    return "book";
  }
  if (normalized.includes("tutorial") && normalized.includes("extras")) {
    return "sparkles";
  }
  if (normalized.includes("nested")) {
    return "layers";
  }
  return undefined;
};

const getIconForDocId = (id) => {
  const normalized = String(id || "").toLowerCase();
  if (normalized.endsWith("intro")) return "home";
  return undefined;
};

const getItem = (item) => {
  const type = item["_template"];

  let itemProps = {
    type: type,
  };

  if (type === "doc") {
    if (!item.document || !docExists(item.document)) {
      return [];
    }

    itemProps.id = getDocId(item.document);
    const icon = getIconForDocId(itemProps.id);
    if (icon) {
      itemProps.customProps = { icon };
    }

    if (item.label) {
      itemProps.label = item.label;
    }
  }

  if (type === "category") {
    if (item.title) {
      itemProps.label = item.title;
    }

    const icon = getIconForCategoryLabel(itemProps.label);
    if (icon) {
      itemProps.customProps = { icon };
    }

    // Categories (parent sections) should not be navigable pages:
    // clicking them expands/collapses but stays on the current page.

    const categoryItems = (item.items || []).flatMap((item) => {
      return getItem(item);
    });

    if (categoryItems.length === 0) {
      return [];
    }

    itemProps.items = categoryItems;
  }

  if (type === "link") {
    if (item.href && item.title) {
      itemProps.label = item.title;
      itemProps.href = item.href;
    } else {
      return [];
    }
  }

  return [itemProps];
};

const sidebars = {
  tutorialSidebar: sidebarData.items.flatMap((item) => {
    return getItem(item);
  }),
};

module.exports = sidebars;
