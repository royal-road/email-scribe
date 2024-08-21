import PreviewPanelHeader from "./subcomponents/PreviewPanelHeader";
import PreviewPanelBody from "./subcomponents/PreviewPanelBody";
import { useState } from "react";

interface PreviewPanelProps {
  htmlToPreview: string;
}
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  htmlToPreview,
}) => {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  return (
    <div className="PreviewPanel">
      <PreviewPanelHeader
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
      />
      <PreviewPanelBody htmlToPreview={htmlToPreview} breakpoint={breakpoint} />
    </div>
  );
};

export default PreviewPanel;
