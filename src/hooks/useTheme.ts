import { useEffect, useState } from "react";

// Used to detect the theme of the RR
export function useTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const checkParentTheme = () => {
      const isDark = document.body.classList.contains("theme-dark");
      setIsDarkTheme(isDark);
    };

    checkParentTheme();

    const observer = new MutationObserver(checkParentTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  return isDarkTheme;
}
