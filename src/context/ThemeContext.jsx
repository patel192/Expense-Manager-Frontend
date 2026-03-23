import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Read saved preference on first load, default to "dark"
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("fintrack-theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement; // <html> element

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Persist preference across page refreshes
    localStorage.setItem("fintrack-theme", theme);
  }, [theme]);

  const setTheme = (newTheme) => setThemeState(newTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);