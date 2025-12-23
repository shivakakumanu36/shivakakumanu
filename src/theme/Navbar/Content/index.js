import React from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import {
  useThemeConfig,
  ErrorCauseBoundary,
  useWindowSize,
} from "@docusaurus/theme-common";
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import NavbarItem from "@theme/NavbarItem";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import SearchBar from "@theme/SearchBar";
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle";
import NavbarLogo from "@theme/Navbar/Logo";
import NavbarSearch from "@theme/Navbar/Search";

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

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items;
}

function NavbarItems({ items }) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              { cause: error }
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
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

  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  const searchBarItem = items.find((item) => item.type === "search");

  const showFloatingNavToggle =
    isMobile && !mobileSidebar.disabled && !isHomePage;

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
            {!mobileSidebar.disabled && !isMobile && (
              <NavbarMobileSidebarToggle />
            )}
            <NavbarLogo />
            <NavbarItems items={leftItems} />
          </>
        }
        right={
          <>
            <Link className="navbar-start-here" to="/docs/start-here">
              Start here
            </Link>
            <NavbarItems items={rightItems} />
            <NavbarColorModeToggle className={styles.colorModeToggle} />
            {!searchBarItem && (
              <NavbarSearch>
                <SearchBar />
              </NavbarSearch>
            )}
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
