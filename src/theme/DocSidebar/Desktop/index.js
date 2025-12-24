import React from "react";
import clsx from "clsx";
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common";
import Logo from "@theme/Logo";
import ColorModeToggle from "@theme/ColorModeToggle";
import CollapseButton from "@theme/DocSidebar/Desktop/CollapseButton";
import Content from "@theme/DocSidebar/Desktop/Content";

import styles from "./styles.module.css";

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }) {
  const themeConfig = useThemeConfig();
  const {
    docs: {
      sidebar: { hideable },
    },
    colorMode: { disableSwitch },
  } = themeConfig;

  const { colorMode, setColorMode } = useColorMode();

  return (
    <div className={clsx(styles.sidebar, isHidden && styles.sidebarHidden)}>
      <div className={styles.headerRow}>
        <Logo
          tabIndex={-1}
          className={styles.header}
          imageClassName={styles.headerLogo}
          titleClassName={styles.headerTitle}
        />
        {!disableSwitch && (
          <ColorModeToggle
            className={styles.colorToggle}
            buttonClassName={styles.colorToggleButton}
            value={colorMode}
            onChange={setColorMode}
          />
        )}
      </div>
      <Content path={path} sidebar={sidebar} className={styles.menu} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
