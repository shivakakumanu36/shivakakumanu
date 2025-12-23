import React from "react";
import clsx from "clsx";
import {
  Collapsible,
  useCollapsible,
  useWindowSize,
} from "@docusaurus/theme-common";
import TOCItems from "@theme/TOCItems";
import TOCCollapsibleOriginal from "@theme-original/TOCCollapsible";

import styles from "./styles.module.css";

function TocIcon({ expanded }) {
  return (
    <svg
      className={clsx(styles.icon, expanded && styles.iconExpanded)}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TOCCollapsible(props) {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";

  const { toc, minHeadingLevel, maxHeadingLevel, className } = props;
  const { collapsed, toggleCollapsed } = useCollapsible({ initialState: true });
  const expanded = !collapsed;

  if (!isMobile) {
    return <TOCCollapsibleOriginal {...props} />;
  }

  return (
    <div className={clsx(styles.mobileRoot, className)}>
      <button
        type="button"
        className={styles.button}
        aria-label={expanded ? "Close on this page" : "Open on this page"}
        aria-expanded={expanded}
        onClick={toggleCollapsed}
      >
        <TocIcon expanded={expanded} />
      </button>

      {expanded && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close on this page"
          onClick={toggleCollapsed}
        />
      )}

      <Collapsible
        lazy
        collapsed={collapsed}
        className={styles.popoverCollapsible}
      >
        <div className={styles.popover} role="dialog" aria-label="On this page">
          <div className={styles.title}>On this page</div>
          <TOCItems
            toc={toc}
            minHeadingLevel={minHeadingLevel}
            maxHeadingLevel={maxHeadingLevel}
          />
        </div>
      </Collapsible>
    </div>
  );
}
