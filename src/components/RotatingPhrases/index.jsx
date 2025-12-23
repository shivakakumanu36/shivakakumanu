import React from "react";
import styles from "./index.module.css";

function hashStringToInt(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function dynamicColor({ phrase, index, total }) {
  const base = hashStringToInt(String(phrase ?? ""));
  const spread = Math.max(total, 1);
  const hue = (base + index * Math.floor(360 / spread)) % 360;
  return `hsl(${hue}, 90%, 55%)`;
}

export function RotatingPhrases({
  prefix = "",
  phrases,
  colors,
  intervalMs = 2200,
}) {
  const phraseList = Array.isArray(phrases) ? phrases : [];
  const phraseCount = phraseList.length;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [phase, setPhase] = React.useState("in");
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    setActiveIndex((prev) => (phraseCount > 0 ? prev % phraseCount : 0));
  }, [phraseCount]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mql) return;

    const onChange = () => setPrefersReducedMotion(Boolean(mql.matches));
    onChange();

    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    if (phraseCount <= 1) return;

    let timeoutId;
    const tick = () => {
      setPhase("out");
      timeoutId = window.setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % phraseCount);
        setPhase("in");
      }, 220);
    };

    const id = window.setInterval(tick, intervalMs);
    return () => {
      window.clearInterval(id);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [intervalMs, phraseCount, prefersReducedMotion]);

  if (phraseCount === 0) return null;

  const phrase = phraseList[activeIndex];
  const hasCustomColors = Array.isArray(colors) && colors.length > 0;
  const color = hasCustomColors
    ? colors[activeIndex % colors.length]
    : dynamicColor({ phrase, index: activeIndex, total: phraseCount });

  return (
    <div className={styles.row} aria-live="polite" aria-atomic="true">
      {prefix ? <span className={styles.prefix}>{prefix}&nbsp;</span> : null}
      <span
        className={`${styles.phrase} ${
          phase === "out" ? styles.phraseOut : styles.phraseIn
        }`}
        style={{ color }}
      >
        {phrase}
      </span>
    </div>
  );
}
