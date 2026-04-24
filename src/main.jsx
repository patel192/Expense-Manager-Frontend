import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import "./index.css"
import { injectStore } from "./components/Utils/axiosInstance.js";

injectStore(store);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
    <Toaster richColors position="top-right" />
  </BrowserRouter>,
);
