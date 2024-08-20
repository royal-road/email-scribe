import { useState } from "react";
import { Button } from "../../../ui/Button";
import { MoonStar, Sun } from "lucide-react";
import BreakpointToggleGroup from "./BreakpointToggleGroup";

export default function PreviewPanelHeader() {
  const [theme, setTheme] = useState<boolean>(false);
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const handleThemeChange = () => {
    const root = document.querySelector("#newsletterDesignerRoot");
    root?.setAttribute("data-theme", !theme ? "light" : "dark");
    setTheme((theme) => !theme);
  };

  return (
    <div className="PreviewPanelHeader">
      Hello From Header! {breakpoint}
      <div title="rightHeader" style={{ display: "flex", gap: "0.5rem" }}>
        <BreakpointToggleGroup
          breakpoint={breakpoint}
          onBreakpointChange={(breakpoint) => setBreakpoint(breakpoint)}
        />
        <Button
          onClick={() => handleThemeChange()}
          variant="outline"
          size="icon"
        >
          {theme ? <Sun /> : <MoonStar />}
        </Button>
      </div>
    </div>
  );
}
