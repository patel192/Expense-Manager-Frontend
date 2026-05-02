// =============== Core Imports ===============
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// =============== State Management ===============
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

// Inject Redux store into axios instance for global dispatch access
import { injectStore } from "./components/Utils/axiosInstance.js";

// =============== Context Providers ===============
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// =============== UI Components ===============
import App from "./App.jsx";
import { Toaster } from "sonner";

// =============== Global Styles  ===============
import "./index.css";

// Intialize shared services before rendering the app
injectStore(store);

// =============== Application Bootstrap ===============
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* Redux Store available to entire app */}
    <Provider store={store}>
      {/* Authentication state and session management */}
      <AuthProvider>
        {/* Global theme configuration dark/light mode, etc. */}
        <ThemeProvider>
          {/* Main application routes */}
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Provider>

    {/* Global toast notifications */}
    <Toaster richColors position="top-right" />
  </BrowserRouter>,
);
