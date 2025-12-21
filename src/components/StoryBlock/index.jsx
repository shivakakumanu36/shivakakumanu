import React from "react";
import styles from "./index.module.css";

export const StoryBlock = ({ data, index }) => {
  const paragraphs = data.paragraphs || [];

  return (
    <section className={styles.storySection} key={index}>
      <div className={styles.storyContainer}>
        {data.image && (
          <div className={styles.storyImageWrapper}>
            <img
              className={styles.storyImage}
              src={data.image}
              alt={data.altText || data.title || "Story image"}
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
        </div>
      </div>
    </section>
  );
};
