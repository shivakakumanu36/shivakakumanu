import React from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";

function NavbarBackdrop(props) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx("navbar-sidebar__backdrop", props.className)}
    />
  );
}

export default function NavbarLayout({ children }) {
  const {
    navbar: { style },
  } = useThemeConfig();
  const mobileSidebar = useNavbarMobileSidebar();

  return (
    <nav
      aria-label={translate({
        id: "theme.NavBar.navAriaLabel",
        message: "Main",
        description: "The ARIA label for the main navigation",
      })}
      className={clsx("navbar", "navbar--fixed-top", {
        "navbar--dark": style === "dark",
        "navbar--primary": style === "primary",
        "navbar-sidebar--show": mobileSidebar.shown,
      })}
      style={{
        height: 0,
        minHeight: 0,
        padding: 0,
        borderBottom: "none",
        background: "transparent",
        boxShadow: "none",
      }}
    >
      {children}
      <NavbarBackdrop onClick={mobileSidebar.toggle} />
      <NavbarMobileSidebar />
    </nav>
  );
}

