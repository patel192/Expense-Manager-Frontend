import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const ThemeContext = createContext();

const getInitialTheme = () => {
  const saved = localStorage.getItem("fintrack-theme");
  if (saved) return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,

          cyan: {
            main: "#06b6d4",
          },

          emerald: {
            main: "#10b981",
          },

          rose: {
            main: "#f43f5e",
          },

          indigo: {
            main: "#6366f1",
          },

          violet: {
            main: "#8b5cf6",
          },
        },
      }),
    [theme],
  );
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("fintrack-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const themeValue = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
