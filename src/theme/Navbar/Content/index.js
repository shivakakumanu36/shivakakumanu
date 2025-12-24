import React from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { useWindowSize } from "@docusaurus/theme-common";
import {
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
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

function FloatingScrollTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={`${styles.floatingFab} ${styles.floatingFabRight}`}
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg
        className={styles.floatingFabIcon}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 5l-6 6m6-6l6 6"
          stroke="currentColor"
          strokeWidth="2.5"
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

  React.useEffect(() => {
    if (!isMobile) return;
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    let clearTimer;

    const setTouching = () => {
      root.setAttribute("data-touching", "true");
      if (clearTimer) window.clearTimeout(clearTimer);
    };

    const clearTouchingSoon = () => {
      if (clearTimer) window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(() => {
        root.removeAttribute("data-touching");
      }, 3000);
    };

    document.addEventListener("touchstart", setTouching, { passive: true });
    document.addEventListener("touchstart", clearTouchingSoon, { passive: true });
    document.addEventListener("touchend", clearTouchingSoon, { passive: true });
    document.addEventListener("touchcancel", clearTouchingSoon, {
      passive: true,
    });

    return () => {
      if (clearTimer) window.clearTimeout(clearTimer);
      root.removeAttribute("data-touching");
      document.removeEventListener("touchstart", setTouching);
      document.removeEventListener("touchstart", clearTouchingSoon);
      document.removeEventListener("touchend", clearTouchingSoon);
      document.removeEventListener("touchcancel", clearTouchingSoon);
    };
  }, [isMobile]);

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
      {isMobile && <FloatingScrollTop />}
    </>
  );
}
