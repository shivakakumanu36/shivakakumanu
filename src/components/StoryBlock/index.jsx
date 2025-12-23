import React from "react";
import styles from "./index.module.css";
import { RotatingPhrases } from "../RotatingPhrases";

export const StoryBlock = ({ data, index }) => {
  const paragraphs = data.paragraphs || [];
  const rotatingPhrases = data.rotatingPhrases || null;
  const rotatingPrefix = data.rotatingPrefix || "I write about";

  return (
    <section className={styles.storySection} key={index}>
      <div className="container">
        <div className={styles.storyContainer}>
          {data.image && (
            <div className={styles.storyImageWrapper}>
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
            {data.title && <h2 className={styles.storyTitle}>{data.title}</h2>}
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
