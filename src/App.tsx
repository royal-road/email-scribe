import BlocksPanel from "./components/panels/blocks";
import PreviewPanel from "./components/panels/preview";
import { useTheme } from "./hooks/useTheme";
import "./styles/styles.scss";

function App() {
  const theme = useTheme();
  return (
    <div
      data-theme={theme}
      className="newsletterDesigner bg-background text-foreground"
    >
      <div className="container">
        <BlocksPanel />
        <PreviewPanel />
      </div>
    </div>
  );
}

export default App;
