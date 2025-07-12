import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error(
      "you 're using a theme context outside of the theme provider"
    );

  return context;
}

export { ThemeProvider, useTheme };
