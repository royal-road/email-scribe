import { useTheme } from "./hooks/useTheme";
import "./styles/styles.scss";

function App() {
  const theme = useTheme();
  return (
    <div
      data-theme={theme}
      className="newsletterDesigner bg-background text-foreground"
    ></div>
  );
}

export default App;
