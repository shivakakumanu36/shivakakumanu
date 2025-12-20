import React, { Suspense, lazy } from "react";
import { Features } from "../Features";

// Lazy load YouTubeEmbed component
const YouTubeEmbed = lazy(() =>
  import("../YouTubeEmbed").then((module) => ({
    default: module.YouTubeEmbed,
  }))
);

// Lazy load Hero component for better initial load
const Hero = lazy(() =>
  import("../Hero").then((module) => ({
    default: module.Hero,
  }))
);

// Loading fallback component
const LoadingFallback = () => <div style={{ minHeight: "200px" }} />;

export const Blocks = ({ blocks }) => {
  return (
    <>
      {blocks
        ? blocks.map(function (block, i) {
            switch (block._template) {
              case "hero":
                return (
                  <div data-tinafield={`blocks.${i}`} key={i + block._template}>
                    <Suspense fallback={<LoadingFallback />}>
                      <Hero data={block} index={i} />
                    </Suspense>
                  </div>
                );
              case "features":
                return (
                  <div data-tinafield={`blocks.${i}`} key={i + block._template}>
                    <Features data={block} index={i} />
                  </div>
                );
              case "youTubeEmbed":
                return (
                  <div data-tinafield={`blocks.${i}`} key={i + block._template}>
                    <Suspense fallback={<LoadingFallback />}>
                      <YouTubeEmbed data={block} index={i} />
                    </Suspense>
                  </div>
                );
              default:
                return null;
            }
          })
        : null}
    </>
  );
};
