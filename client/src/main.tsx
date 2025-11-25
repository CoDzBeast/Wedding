import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Function to render the React app
function renderApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
}

// Check if overlay exists
const overlay = document.getElementById('intro-overlay');

if (overlay) {
  // Wait for overlay to be removed
  window.addEventListener('overlayRemoved', renderApp);
} else {
  // If no overlay, render immediately
  renderApp();
}