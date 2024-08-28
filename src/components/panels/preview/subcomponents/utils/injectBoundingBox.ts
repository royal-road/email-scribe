export const injectHoverScript = (doc: Document, zoomFactor: number) => {
  const script = doc.createElement('script');
  script.textContent = `
    (function() {
      let hoverBox = document.createElement('div');
      hoverBox.style.position = 'fixed';
      hoverBox.style.border = '2px solid #007bff';
      hoverBox.style.pointerEvents = 'none';
      hoverBox.style.zIndex = '9999';
      document.body.appendChild(hoverBox);

      let currentTarget = null;
      const zoomFactor = ${zoomFactor};

      function updateBoxPosition() {
        if (currentTarget) {
          let rect = currentTarget.getBoundingClientRect();
          hoverBox.style.left = (rect.left / zoomFactor) + 'px';
          hoverBox.style.top = (rect.top / zoomFactor) + 'px';
          hoverBox.style.width = (rect.width / zoomFactor) + 'px';
          hoverBox.style.height = (rect.height / zoomFactor) + 'px';
          hoverBox.style.display = 'block';
        }
      }

      function findEditorIdElement(element) {
        while (element && element !== document.body) {
          if (element.hasAttribute('editorId')) {
            return element;
          }
          element = element.parentElement;
        }
        return null;
      }

      document.body.addEventListener('mouseover', function(e) {
        let targetWithEditorId = findEditorIdElement(e.target);
        if (targetWithEditorId) {
          currentTarget = targetWithEditorId;
          updateBoxPosition();
        } else {
          currentTarget = null;
          hoverBox.style.display = 'none';
        }
      });

      document.body.addEventListener('mouseout', function(e) {
        if (!e.relatedTarget || !findEditorIdElement(e.relatedTarget)) {
          currentTarget = null;
          hoverBox.style.display = 'none';
        }
      });

      window.addEventListener('scroll', updateBoxPosition);
      window.addEventListener('resize', updateBoxPosition);

      // Add custom event for clicks
      document.body.addEventListener('click', function(e) {
        let targetWithEditorId = findEditorIdElement(e.target);
        if (targetWithEditorId) {
          let event = new CustomEvent('editorElementClicked', {
            detail: {
              editorId: targetWithEditorId.getAttribute('editorId'),
              moduleId: targetWithEditorId.closest('[data-module]')?.getAttribute('editorid') || ''
            },
            bubbles: true
          });
          targetWithEditorId.dispatchEvent(event);
        }
      });
    })();
  `;
  doc.body.appendChild(script);
};
