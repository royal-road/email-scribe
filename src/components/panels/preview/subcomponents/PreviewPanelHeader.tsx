import { useState } from "react";
import { Button } from "../../../ui/Button";

export default function PreviewPanelHeader() {
  const [theme, setTheme] = useState<boolean>(false);
  const handleThemeChange = () => {
    // Gotta change data-theme to light/dark
    const root = document.querySelector("#newsletterDesignerRoot");
    root?.setAttribute("data-theme", !theme ? "light" : "dark");
    setTheme((theme) => !theme);
  };

  return (
    <div className="PreviewPanelHeader">
      Hello From Header!
      <Button onClick={() => handleThemeChange()}>Change Theme</Button>
    </div>
  );
}
