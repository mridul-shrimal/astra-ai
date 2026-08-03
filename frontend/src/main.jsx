import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 2500,
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #334155",
        },
        success: {
          iconTheme: {
            primary: "#06b6d4",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />

    <AuthProvider>
  <ThemeProvider>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </ThemeProvider>
</AuthProvider>
  </>
);