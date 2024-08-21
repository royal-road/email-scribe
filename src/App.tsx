import { useState } from "react";
import { BlocksPanel } from "./components/panels/blocks";
import PreviewPanel from "./components/panels/preview";
import { useTheme } from "./hooks/useTheme";
import "./styles/styles.scss";

function App() {
  const theme = useTheme();
  const [html, setHtml] = useState("");
  return (
    <div
      id="newsletterDesignerRoot"
      data-theme={theme}
      className="newsletterDesigner bg-background text-foreground"
    >
      <div className="container">
        <BlocksPanel onUpdateFinalHtml={setHtml} />
        <PreviewPanel htmlToPreview={html} />
      </div>
    </div>
  );
}

export default App;
