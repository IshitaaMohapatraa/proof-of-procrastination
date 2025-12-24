import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PerformanceProvider } from "./hooks/usePerformance";

createRoot(document.getElementById("root")!).render(
  <PerformanceProvider>
    <App />
  </PerformanceProvider>
);
