import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
