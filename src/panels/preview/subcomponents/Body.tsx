import React, { useEffect, useRef, useState } from 'react';
import { Breakpoints } from '@/panels/preview/subcomponents/BreakpointToggleGroup';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { prepareHtmlForPreview } from '@/panels/preview/utils/prepareForPreview';
import { CollapsibleFocusProps } from '@/panels/blocks';

interface PreviewPanelBodyProps {
  htmlToPreview: string;
  breakpoint: Breakpoints['breakpoint'];
  setBlockToFocus: (blockToFocus: CollapsibleFocusProps | null) => void;
  nonce?: string;
}

const breakpointSettings = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1366, height: 768 }, // Changed to a more common desktop resolution
};

export const PreviewPanel: React.FC<PreviewPanelBodyProps> = ({
  htmlToPreview,
  breakpoint,
  setBlockToFocus,
  nonce,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Media query to detect if we're on a mobile device
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        const preparedHtml = prepareHtmlForPreview(
          htmlToPreview,
          breakpoint,
          isMobile,
          nonce
        );
        // Write the modified HTML to the iframe
        doc.open();
        doc.write(preparedHtml);
        doc.close();
      }

      // Add event listener to the iframe so I can read the clicked element
      const handleEditorElementClick = (event: CustomEvent) => {
        setBlockToFocus({
          collapsibleId: event.detail.moduleId,
          fieldId: event.detail.editorId,
        });
      };

      iframeRef.current.contentWindow?.addEventListener(
        'editorElementClicked',
        handleEditorElementClick as EventListener
      );

      return () => {
        iframeRef.current?.contentWindow?.removeEventListener(
          'editorElementClicked',
          handleEditorElementClick as EventListener
        );
      };
    }
  }, [htmlToPreview, breakpoint, isMobile]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        let { width, height } = breakpointSettings[breakpoint];

        // For desktop, always use landscape orientation
        if (breakpoint === 'desktop') {
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
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [breakpoint]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: '100%',
          maxHeight: '100%',
          minHeight: '40rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <iframe
          ref={iframeRef}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid var(--border)',
          }}
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
