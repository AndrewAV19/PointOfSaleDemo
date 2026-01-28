import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import PointOfSale from "./PointOfSale.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PointOfSale />
    </BrowserRouter>
  </StrictMode>
);
