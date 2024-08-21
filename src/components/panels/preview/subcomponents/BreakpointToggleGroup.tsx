import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "../../../ui/button";

export interface Breakpoints {
  breakpoint: "mobile" | "tablet" | "desktop";
  onBreakpointChange: (breakpoint: "mobile" | "tablet" | "desktop") => void;
}

export default function BreakpointToggleGroup({
  breakpoint,
  onBreakpointChange,
}: Breakpoints) {
  return (
    <div className="BreakpointToggleGroup">
      <Button
        title="Mobile"
        variant="outline"
        onClick={() => onBreakpointChange("mobile")}
        className={`${breakpoint === "mobile" && "active"} `}
        style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
        size="icon"
      >
        <Smartphone
          className="ToggleGroupIcon"
          style={{ marginRight: "0.125rem", marginLeft: "0.125rem" }}
        />
      </Button>
      <Button
        title="Tablet"
        variant="outline"
        onClick={() => onBreakpointChange("tablet")}
        className={`${breakpoint === "tablet" && "active"} `}
        style={{ borderRadius: 0 }}
        size="icon"
      >
        <Tablet
          style={{
            transform: "rotate(90deg)",
            marginRight: "0.125rem",
            marginLeft: "0.125rem",
          }}
          className="ToggleGroupIcon"
        />
      </Button>
      <Button
        title="Desktop"
        variant="outline"
        onClick={() => onBreakpointChange("desktop")}
        className={`${breakpoint === "desktop" && "active"} `}
        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
        size="icon"
      >
        <Monitor
          className="ToggleGroupIcon"
          style={{ marginRight: "0.125rem", marginLeft: "0.125rem" }}
        />
      </Button>
    </div>
  );
}
