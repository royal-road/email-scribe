import { useState } from "react";
import { Button } from "../../../ui/button";
import { MoonStar, Sun } from "lucide-react";
import BreakpointToggleGroup, { Breakpoints } from "./BreakpointToggleGroup";

const PreviewPanelHeader: React.FC<Breakpoints> = ({
  breakpoint,
  onBreakpointChange,
}) => {
  const [theme, setTheme] = useState<boolean>(false);
  const handleThemeChange = () => {
    const root = document.querySelector("#newsletterDesignerRoot");
    root?.setAttribute("data-theme", !theme ? "light" : "dark");
    setTheme((theme) => !theme);
  };

  return (
    <div className="PreviewPanelHeader">
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <h4>Preview</h4>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <BreakpointToggleGroup
          breakpoint={breakpoint}
          onBreakpointChange={(breakpoint) => onBreakpointChange(breakpoint)}
        />
        <Button
          title="Toggle Theme"
          onClick={() => handleThemeChange()}
          variant="outline"
          size="icon"
        >
          {theme ? <Sun /> : <MoonStar />}
        </Button>
      </div>
    </div>
  );
};

export default PreviewPanelHeader;
