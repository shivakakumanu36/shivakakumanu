import React, { useState, useEffect } from "react";
import styles from "./index.module.css";

// Extract video ID from YouTube URL
const extractVideoId = (url) => {
  const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  const match = regex.exec(url);
  return match ? match[3] : null;
};

export const YouTubeEmbed = ({ data, index }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoId = extractVideoId(data.url);

  if (!videoId) {
    return <div>Invalid YouTube URL: {data.url}</div>;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const handlePlayClick = () => {
    setIsLoaded(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlayClick();
    }
  };

  useEffect(() => {
    // Preload image on component mount for better performance
    const img = new Image();
    img.src = thumbnailUrl;
    img.onerror = () => {
      // Fallback to lower quality if maxres is not available
      const fallbackImg = new Image();
      fallbackImg.src = fallbackThumbnailUrl;
    };
  }, [videoId]);

  return (
    <section key={index} className={styles.youtubeSection}>
      <div className="container">
        <div className={styles.video}>
          {data.title && <h2>{data.title}</h2>}
          {!isLoaded ? (
            <div
              className={styles.thumbnail}
              onClick={handlePlayClick}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex="0"
              aria-label={`Play video: ${data.title || "YouTube video"}`}
              style={{
                backgroundImage: `url('${thumbnailUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                paddingBottom: "56.25%",
                position: "relative",
                cursor: "pointer",
                backgroundColor: "#000",
              }}
            >
              {/* Play button */}
              <button
                className={styles.playButton}
                aria-label={`Play video: ${data.title || "YouTube video"}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(255, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0",
                  zIndex: 2,
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                <span
                  style={{
                    width: "0",
                    height: "0",
                    borderLeft: "30px solid white",
                    borderTop: "20px solid transparent",
                    borderBottom: "20px solid transparent",
                    marginLeft: "5px",
                  }}
                  aria-hidden="true"
                />
              </button>
            </div>
          ) : (
            <iframe
              width="853"
              height="480"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={data.title || "Embedded youtube video"}
              loading="lazy"
              className={styles.youtubeIframe}
              style={{
                width: "100%",
                maxWidth: "100%",
                aspectRatio: "16 / 9",
                border: "none",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};
