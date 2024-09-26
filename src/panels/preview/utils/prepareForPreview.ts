import { injectHoverScript } from '@/panels/preview/utils/injectBoundingBox';

export const prepareHtmlForPreview = (
  htmlToPreview: string,
  breakpoint: string,
  isMobile: boolean,
  nonce?: string
): string => {
  const parser = new DOMParser();
  let htmlDoc;

  try {
    htmlDoc = parser.parseFromString(htmlToPreview, 'text/html');
  } catch (error) {
    console.error(`Error parsing file content: ${error}`);
    return '';
  }

  if (htmlDoc.body.innerHTML.trim() === '') {
    htmlDoc.body.innerHTML = `<div style="display: flex; font-family:'Helvetica Neue', Arial, sans-serif; justify-content: center; font-weight:100; align-items: center; height: 100%; font-family: sans-serif; font-size: 1.5rem; color: #737373;">~Wow, so empty~</div>`;
  }

  // Inject target="_blank" attribute to all links
  const links = htmlDoc.querySelectorAll('a');
  links.forEach((link) => {
    // link.setAttribute('target', '_blank');

    // Removes the href attribute to prevent the link from navigating and making the preview unusable
    link.removeAttribute('href');
  });

  // Determine zoom factor
  let zoomFactor = 1;
  if (isMobile) {
    if (breakpoint === 'desktop') {
      zoomFactor = 0.25;
    } else if (breakpoint === 'tablet') {
      zoomFactor = 0.5;
    }
  } else {
    if (breakpoint === 'mobile') {
      zoomFactor = 1.25;
    } else if (breakpoint === 'tablet') {
      zoomFactor = 1.1;
    }
  }

  // Add or update the zoom style
  let styleTag = htmlDoc.querySelector('style#preview-zoom');
  if (!styleTag) {
    styleTag = htmlDoc.createElement('style');
    styleTag.id = 'preview-zoom';
    htmlDoc.head.appendChild(styleTag);
  }
  styleTag.textContent = `
    body {
      zoom: ${zoomFactor};
    }
  `;
  injectHoverScript(htmlDoc, zoomFactor, nonce);
  return htmlDoc.documentElement.outerHTML;
};
