// =============== CORE IMPORTS ===============
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// =============== STATE MANAGEMENT ===============
// Redux setup for global state handling
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

// We inject the store into axios so we can handle 401s and loading 
// states globally without being inside a React component.
import { injectStore } from "./components/Utils/axiosInstance.js";

// =============== CONTEXT PROVIDERS ===============
// Legacy context or simple state that doesn't need Redux
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// =============== UI COMPONENTS ===============
import App from "./App.jsx";
import { Toaster } from "sonner"; // For those nice pop-up notifications

// =============== GLOBAL STYLES ===============
import "./index.css";

// --- PRE-RENDER SETUP ---
injectStore(store);

/**
 * --- APPLICATION BOOTSTRAP ---
 * Wrapping the app in all necessary providers.
 */
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* Provides global state (Auth, UI, etc.) */}
    <Provider store={store}>
      {/* Handles user session and login state */}
      <AuthProvider>
        {/* Manages Dark/Light mode preferences */}
        <ThemeProvider>
          {/* The actual application content and routes */}
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Provider>

    {/* Toast notification container (renders at the top level) */}
    <Toaster richColors position="top-right" />
  </BrowserRouter>,
);

