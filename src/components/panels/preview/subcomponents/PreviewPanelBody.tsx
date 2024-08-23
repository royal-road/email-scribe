import React, { useEffect, useRef, useState } from "react";
import { Breakpoints } from "./BreakpointToggleGroup";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";

interface PreviewPanelBodyProps {
  htmlToPreview: string;
  breakpoint: Breakpoints["breakpoint"];
}

const breakpointSettings = {
  mobile: { width: 375, height: 667, deviceScaleFactor: 1 },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 1 },
  desktop: { width: 1366, height: 768, deviceScaleFactor: 2 }, // Changed to a more common desktop resolution
};

export const PreviewPanel: React.FC<PreviewPanelBodyProps> = ({
  htmlToPreview,
  breakpoint,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Media query to detect if we're on a mobile device
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        // Parse the HTML string
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlToPreview, "text/html");

        // Determine zoom factor
        let zoomFactor = 1;
        if (isMobile) {
          // On mobile devices
          if (breakpoint === "desktop") {
            zoomFactor = 0.25; // Significant zoom out for desktop view on mobile
          } else if (breakpoint === "tablet") {
            zoomFactor = 0.5; // Moderate zoom out for tablet view on mobile
          }
          // For mobile breakpoint on mobile device, keep zoom at 1
        } else {
          // On desktop devices
          if (breakpoint === "mobile") {
            zoomFactor = 1.5; // Slight zoom in for mobile view on desktop
          }
          // For tablet and desktop breakpoints on desktop, keep zoom at 1
        }

        // Add or update the zoom style
        let styleTag = htmlDoc.querySelector("style#preview-zoom");
        if (!styleTag) {
          styleTag = htmlDoc.createElement("style");
          styleTag.id = "preview-zoom";
          htmlDoc.head.appendChild(styleTag);
        }
        styleTag.textContent = `
          body {
            zoom: ${zoomFactor};
          }
        `;

        // Write the modified HTML to the iframe
        doc.open();
        doc.write(htmlDoc.documentElement.outerHTML);
        doc.close();
      }
    }
  }, [htmlToPreview, breakpoint, isMobile]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        let { width, height } = breakpointSettings[breakpoint];

        // For desktop, always use landscape orientation
        if (breakpoint === "desktop") {
          if (width < height) {
            [width, height] = [height, width];
          }
        }

        const aspectRatio = width / height;

        let newWidth = Math.min(width, containerWidth);
        let newHeight = newWidth / aspectRatio;

        if (newHeight > containerHeight) {
          newHeight = containerHeight;
          newWidth = newHeight * aspectRatio;
        }

        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [breakpoint]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: "100%",
          maxHeight: "100%",
          minHeight: "40rem",
          transition: "all 0.3s ease",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <iframe
          ref={iframeRef}
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid var(--border)",
          }}
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
