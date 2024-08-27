export const injectHoverScript = (doc: Document) => {
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

      function updateBoxPosition() {
        if (currentTarget) {
          let rect = currentTarget.getBoundingClientRect();
          hoverBox.style.left = rect.left + 'px';
          hoverBox.style.top = rect.top + 'px';
          hoverBox.style.width = rect.width + 'px';
          hoverBox.style.height = rect.height + 'px';
          hoverBox.style.display = 'block';
        }
      }

      document.body.addEventListener('mouseover', function(e) {
        let target = e.target;
        while(target && target !== document.body) {
          if(target.hasAttribute('editorId')) {
            currentTarget = target;
            updateBoxPosition();
            return;
          }
          target = target.parentElement;
        }
        currentTarget = null;
        hoverBox.style.display = 'none';
      });

      document.body.addEventListener('mouseout', function() {
        currentTarget = null;
        hoverBox.style.display = 'none';
      });

      window.addEventListener('scroll', updateBoxPosition);
      window.addEventListener('resize', updateBoxPosition);
    })();
  `;
  doc.body.appendChild(script);
};
