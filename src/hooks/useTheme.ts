import { useEffect, useState } from "react";

// Used to detect the theme of the RR (Might need adjustments in prod)
export function useTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const checkParentTheme = () => {
      const isDark = document.body.classList.contains("theme-dark");
      setIsDarkTheme(isDark ? "dark" : "light");
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
