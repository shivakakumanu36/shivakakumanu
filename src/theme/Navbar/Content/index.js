import React from "react";
import { useWindowSize } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";

import styles from "./styles.module.css";

function FloatingNavToggle({ mobileSidebar }) {
  const isOpen = Boolean(mobileSidebar?.shown);

  return (
    <button
      type="button"
      className={`${styles.floatingFab} ${styles.floatingFabLeft}`}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
      onClick={() => mobileSidebar.toggle()}
    >
      <svg
        className={`${styles.floatingFabIcon} ${
          isOpen ? styles.floatingFabIconOpen : ""
        }`}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 7h16M4 12h12M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function NavbarContent() {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";

  const mobileSidebar = useNavbarMobileSidebar();
  const showFloatingNavToggle = isMobile && !mobileSidebar.disabled;

  if (!showFloatingNavToggle) return null;

  return <FloatingNavToggle mobileSidebar={mobileSidebar} />;
}
