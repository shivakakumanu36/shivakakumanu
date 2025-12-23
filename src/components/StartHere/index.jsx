import React from "react";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

const Section = ({ title, children }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
  </section>
);

const CardLink = ({ to, href, children, description }) => {
  const content = (
    <>
      <span className={styles.cardTitle}>{children}</span>
      {description ? (
        <span className={styles.cardDescription}>{description}</span>
      ) : null}
      <span className={styles.cardArrow} aria-hidden="true">
        →
      </span>
    </>
  );

  if (to) {
    return (
      <Link className={styles.card} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <a className={styles.card} href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
};

export function StartHere() {
  return (
    <div className={styles.wrap}>
      <p className={styles.lede}>
        Pick a starting point — each link matches the left sidebar.
      </p>

      <Section title="Tutorial - Basics">
        <div className={styles.grid}>
          <CardLink
            to="/docs/tutorial-basics/create-a-page"
            description="Build your first docs page"
          >
            Create a Page
          </CardLink>
          <CardLink
            to="/docs/tutorial-basics/create-a-document"
            description="Add and organize docs content"
          >
            Create a Document
          </CardLink>
          <CardLink
            to="/docs/tutorial-basics/create-a-blog-post"
            description="Publish your first post"
          >
            Create a Blog Post
          </CardLink>
          <CardLink
            to="/docs/tutorial-basics/deploy-your-site"
            description="Ship the site"
          >
            Deploy Your Site
          </CardLink>
          <CardLink
            to="/docs/tutorial-basics/congratulations"
            description="Wrap up"
          >
            Congratulations
          </CardLink>
        </div>
      </Section>

      <Section title="Tutorial - Extras">
        <div className={styles.grid}>
          <CardLink
            to="/docs/tutorial-extras/manage-docs-versions"
            description="Version your docs"
          >
            Manage Docs Versions
          </CardLink>
          <CardLink
            to="/docs/tutorial-extras/translate-your-site"
            description="Add translations"
          >
            Translate Your Site
          </CardLink>
        </div>
      </Section>

      <Section title="Nested Link">
        <div className={styles.grid}>
          <CardLink to="/docs/test-page" description="Level 3">
            Level 2
          </CardLink>
        </div>
      </Section>

      <Section title="External">
        <div className={styles.grid}>
          <CardLink href="https://tina.io/" description="TinaCMS">
            Tina.io
          </CardLink>
        </div>
      </Section>
    </div>
  );
}

