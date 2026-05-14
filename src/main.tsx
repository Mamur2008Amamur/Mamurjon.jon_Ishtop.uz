import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
<<<<<<< HEAD
import { LanguageProvider } from "./contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
=======
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(<App />);
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
