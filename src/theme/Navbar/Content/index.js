import React from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { useWindowSize } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import NavbarLogo from "@theme/Navbar/Logo";

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

function NavbarContentLayout({
  left,
  right,
}) {
  return (
    <div className="navbar__inner">
      <div className="navbar__items">{left}</div>
      <div className="navbar__items navbar__items--right">{right}</div>
    </div>
  );
}

export default function NavbarContent() {
  const location = useLocation();
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";
  const isHomePage = location.pathname === "/";

  const mobileSidebar = useNavbarMobileSidebar();
  const showFloatingNavToggle = isMobile && !mobileSidebar.disabled;

  return (
    <>
      <NavbarContentLayout
        left={
          <>
            {!isMobile ? (
              <NavbarLogo />
            ) : isHomePage ? (
              <Link className={styles.mobileBrand} to="/">
                SHIVA KAKUMANU
              </Link>
            ) : null}
          </>
        }
        right={
          <>
            {isHomePage ? (
              <Link className="navbar-start-here" to="/docs/intro">
                Start here
              </Link>
            ) : null}
            <NavbarColorModeToggle className={styles.colorModeToggle} />
          </>
        }
      />
      {showFloatingNavToggle && (
        <FloatingNavToggle mobileSidebar={mobileSidebar} />
      )}
    </>
  );
}
