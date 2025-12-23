import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { isActiveSidebarItem } from "@docusaurus/theme-common/internal";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";
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
    case "home":
      return (
        <svg {...common}>
          <path
            d="M10.5 19.5v-6h3v6m-9-8.5L12 4.5l7.5 6.5v8a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1v-8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <path
            d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 11v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 7h.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path
            d="M10 13a5 5 0 0 1 0-7l.5-.5a5 5 0 0 1 7 7l-1 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 11a5 5 0 0 1 0 7l-.5.5a5 5 0 0 1-7-7l1-1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const { href, label, className, autoAddBaseUrl, customProps } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const iconName = customProps?.icon;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        "menu__list-item",
        className
      )}
      key={label}
    >
      <Link
        className={clsx("menu__link", styles.menuLinkWithIcon, {
          "menu__link--active": isActive,
        })}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? "page" : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}
      >
        {iconName ? (
          <span className={styles.iconWrap}>
            <SidebarIcon name={iconName} />
          </span>
        ) : null}
        <span>{label}</span>
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}

