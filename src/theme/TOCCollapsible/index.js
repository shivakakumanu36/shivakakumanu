import React from "react";
import { useWindowSize } from "@docusaurus/theme-common";
import TOCCollapsibleOriginal from "@theme-original/TOCCollapsible";

export default function TOCCollapsible(props) {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";

  if (isMobile) return null;

  return <TOCCollapsibleOriginal {...props} />;
}
