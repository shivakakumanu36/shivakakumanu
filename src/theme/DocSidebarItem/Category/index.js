import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from "@docusaurus/theme-common";
import {
  isActiveSidebarItem,
  findFirstSidebarItemLink,
  useDocSidebarItemsExpandedState,
  isSamePath,
} from "@docusaurus/theme-common/internal";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useIsBrowser from "@docusaurus/useIsBrowser";
import DocSidebarItems from "@theme/DocSidebarItems";
import styles from "../styles.module.css";

function SidebarIcon({ name }) {
  if (!name) return null;

  const common = {
    className: styles.iconSvg,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  switch (name) {
    case "book":
      return (
        <svg {...common}>
          <path
            d="M4 19a2 2 0 0 0 2 2h13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8 7h7M8 11h7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path
            d="M12 2l1.2 4.2L17.5 7.5l-4.3 1.3L12 13l-1.2-4.2L6.5 7.5l4.3-1.3L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M19 12l.7 2.4L22 15l-2.3.6L19 18l-.7-2.4L16 15l2.3-.6L19 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path
            d="M12 3l9 5-9 5-9-5 9-5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M3 13l9 5 9-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function useAutoExpandActiveCategory({ isActive, collapsed, updateCollapsed }) {
  const wasActive = usePrevious(isActive);
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    if (justBecameActive && collapsed) {
      updateCollapsed(false);
    }
  }, [isActive, wasActive, collapsed, updateCollapsed]);
}

function useCategoryHrefWithSSRFallback(item) {
  const isBrowser = useIsBrowser();
  return useMemo(() => {
    if (item.href && !item.linkUnlisted) {
      return item.href;
    }
    if (isBrowser || !item.collapsible) {
      return undefined;
    }
    return findFirstSidebarItemLink(item);
  }, [item, isBrowser]);
}

function CollapseButton({ collapsed, categoryLabel, onClick }) {
  return (
    <button
      aria-label={
        collapsed
          ? translate(
              {
                id: "theme.DocSidebarItem.expandCategoryAriaLabel",
                message: "Expand sidebar category '{label}'",
                description: "The ARIA label to expand the sidebar category",
              },
              { label: categoryLabel }
            )
          : translate(
              {
                id: "theme.DocSidebarItem.collapseCategoryAriaLabel",
                message: "Collapse sidebar category '{label}'",
                description: "The ARIA label to collapse the sidebar category",
              },
              { label: categoryLabel }
            )
      }
      aria-expanded={!collapsed}
      type="button"
      className="clean-btn menu__caret"
      onClick={onClick}
    />
  );
}

export default function DocSidebarItemCategory({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const { items, label, collapsible, className, href, customProps } = item;
  const {
    docs: {
      sidebar: { autoCollapseCategories },
    },
  } = useThemeConfig();
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);
  const isActive = isActiveSidebarItem(item, activePath);
  const isCurrentPage = isSamePath(href, activePath);
  const { collapsed, setCollapsed } = useCollapsible({
    initialState: () => {
      if (!collapsible) {
        return false;
      }
      return isActive ? false : item.collapsed;
    },
  });
  const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState();
  const updateCollapsed = (toCollapsed = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  };
  useAutoExpandActiveCategory({ isActive, collapsed, updateCollapsed });
  useEffect(() => {
    if (
      collapsible &&
      expandedItem != null &&
      expandedItem !== index &&
      autoCollapseCategories
    ) {
      setCollapsed(true);
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

  const iconName = customProps?.icon;
  const isTopLevel = level === 1;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        "menu__list-item",
        {
          "menu__list-item--collapsed": collapsed,
        },
        className
      )}
    >
      <div
        className={clsx("menu__list-item-collapsible", {
          "menu__list-item-collapsible--active": isCurrentPage,
        })}
      >
        <Link
          className={clsx("menu__link", styles.menuLinkWithIcon, {
            "menu__link--sublist": collapsible,
            "menu__link--sublist-caret": !href && collapsible,
            "menu__link--active": isActive,
          })}
          onClick={
            collapsible
              ? (e) => {
                  onItemClick?.(item);
                  if (href) {
                    updateCollapsed(false);
                  } else {
                    e.preventDefault();
                    updateCollapsed();
                  }
                }
              : () => {
                  onItemClick?.(item);
                }
          }
          aria-current={isCurrentPage ? "page" : undefined}
          role={collapsible && !href ? "button" : undefined}
          aria-expanded={collapsible && !href ? !collapsed : undefined}
          href={collapsible ? hrefWithSSRFallback ?? "#" : hrefWithSSRFallback}
          {...props}
        >
          {isTopLevel && iconName ? (
            <span className={clsx(styles.iconWrap, styles.topLevelIconWrap)}>
              <SidebarIcon name={iconName} />
            </span>
          ) : null}
          <span
            className={clsx(
              isTopLevel ? styles.topLevelLabel : styles.nestedLabel,
              isTopLevel && isActive && styles.activeTopLevelLabel
            )}
          >
            {label}
          </span>
        </Link>
        {href && collapsible && (
          <CollapseButton
            collapsed={collapsed}
            categoryLabel={label}
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}
