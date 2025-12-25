import React from "react";
import styles from "./index.module.css";
import { RotatingPhrases } from "../RotatingPhrases";

export const StoryBlock = ({ data, index }) => {
  const sectionRef = React.useRef(null);
  const imageWrapperRef = React.useRef(null);
  const titleRef = React.useRef(null);

  const paragraphs = data.paragraphs || [];
  const rotatingPhrases = data.rotatingPhrases || null;
  const rotatingPrefix = data.rotatingPrefix || "I write about";

  React.useEffect(() => {
    if (!data?.image || !data?.title) return;
    if (typeof window === "undefined") return;

    const mobileMediaQuery = window.matchMedia("(max-width: 768px)");
    let rafId = 0;

    const updateHeroImageHeight = () => {
      const sectionEl = sectionRef.current;
      const imageWrapperEl = imageWrapperRef.current;
      const titleEl = titleRef.current;
      if (!sectionEl || !imageWrapperEl || !titleEl) return;

      if (!mobileMediaQuery.matches) {
        imageWrapperEl.style.removeProperty("--story-hero-image-height");
        return;
      }

      if (window.scrollY > 0) return;

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const titleRect = titleEl.getBoundingClientRect();
      const imageRect = imageWrapperEl.getBoundingClientRect();
      const gapBetweenImageAndTitle = Math.max(0, titleRect.top - imageRect.bottom);
      const topInset = Math.max(0, imageRect.top);

      const buffer = 24;
      const desiredHeight = Math.floor(
        viewportHeight -
          topInset -
          gapBetweenImageAndTitle -
          titleRect.height -
          buffer
      );

      const minHeight = 240;
      const clampedHeight = Math.max(minHeight, desiredHeight);
      imageWrapperEl.style.setProperty(
        "--story-hero-image-height",
        `${clampedHeight}px`
      );
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateHeroImageHeight);
    };

    scheduleUpdate();

    window.addEventListener("resize", scheduleUpdate);

    const vv = window.visualViewport;
    vv?.addEventListener("resize", scheduleUpdate);

    if (mobileMediaQuery.addEventListener) {
      mobileMediaQuery.addEventListener("change", scheduleUpdate);
    } else {
      mobileMediaQuery.addListener(scheduleUpdate);
    }

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleUpdate)
        : null;
    const titleElForObserver = titleRef.current;
    if (titleElForObserver) {
      ro?.observe(titleElForObserver);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      vv?.removeEventListener("resize", scheduleUpdate);
      ro?.disconnect();

      if (mobileMediaQuery.removeEventListener) {
        mobileMediaQuery.removeEventListener("change", scheduleUpdate);
      } else {
        mobileMediaQuery.removeListener(scheduleUpdate);
      }
    };
  }, [data?.image, data?.title]);

  return (
    <section className={styles.storySection} key={index} ref={sectionRef}>
      <div className="container">
        <div className={styles.storyContainer}>
          {data.image && (
            <div className={styles.storyImageWrapper} ref={imageWrapperRef}>
              <img
                className={styles.storyImage}
                src={data.image}
                alt={data.altText || data.title || "Story image"}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div className={styles.storyContent}>
            {data.title && (
              <h2 className={styles.storyTitle} ref={titleRef}>
                {data.title}
              </h2>
            )}
            {paragraphs.map((text, idx) => (
              <p key={idx} className={styles.storyParagraph}>
                {text}
              </p>
            ))}
            {rotatingPhrases ? (
              <div className={styles.rotatingWrap}>
                <RotatingPhrases
                  prefix={rotatingPrefix}
                  phrases={rotatingPhrases}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
