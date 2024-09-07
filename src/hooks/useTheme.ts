import { useEffect, useState } from 'react';

// Used to detect the theme of the RR (Defaults to dark mode)
export function useTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const checkParentTheme = () => {
      const isDark = document.body.classList.contains('theme-dark');
      // Only set to light if explicitly detected as light (default to dark)
      if (!isDark && document.body.classList.contains('theme-light')) {
        setIsDarkTheme('light');
      } else {
        setIsDarkTheme('dark');
      }
    };

    checkParentTheme();

    const observer = new MutationObserver(checkParentTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkTheme;
}
