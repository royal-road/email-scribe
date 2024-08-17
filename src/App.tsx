import "./styles/App.scss";
import { useTheme } from "./hooks/useTheme";

function App() {
  const theme = useTheme();
  return (
    <div data-bs-theme={theme}>
      <div className="container">
        <h1>Newsletter Builder</h1>
        <p>Build your newsletter with ease!</p>
      </div>
    </div>
  );
}

export default App;
