/*
|--------------------------------------------------------------------------
| Theme Context
|--------------------------------------------------------------------------
| Controls Light and Dark mode across the admin panel.
|--------------------------------------------------------------------------
*/

import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");

  function toggleTheme() {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      <div
        className={
          theme === "dark"
            ? "dark bg-slate-900 min-h-screen"
            : "bg-gray-100 min-h-screen"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}