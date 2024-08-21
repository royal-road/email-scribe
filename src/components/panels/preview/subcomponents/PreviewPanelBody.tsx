import { Breakpoints } from "./BreakpointToggleGroup";

interface PreviewPanelBodyProps {
  htmlToPreview: string;
  breakpoint: Breakpoints["breakpoint"];
}

const breakpointMap = {
  mobile: { w: "320px", h: "568px" },
  tablet: { w: "768px", h: "1024px" },
  desktop: { w: "100%", h: "100%" },
};

export const PreviewPanel: React.FC<PreviewPanelBodyProps> = ({
  htmlToPreview,
  breakpoint,
}) => {
  return (
    <div className="PreviewPanelBody">
      <div
        className="PreviewPanelBodyScreen"
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          width: breakpointMap[breakpoint].w,
          height: breakpointMap[breakpoint].h,
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: htmlToPreview }}
      ></div>
    </div>
  );
};

export default PreviewPanel;
