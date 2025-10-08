import { createContext, useContext, useEffect, useState } from "react";
import {
  localStorageColorThemeKey,
  localStorageFontThemeKey,
  localStorageSavedActiveSettingKey,
} from "../config/constants";
import { useLocation } from "react-router";

const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const location = useLocation();
  const allNotesPage = location.pathname.includes("/all-notes");
  const [uiPage, setUiPage] = useState("settingsPage");

  const [colorThemePreference, setColorThemePreference] = useState(function () {
    return localStorage.getItem(localStorageColorThemeKey) || "system";
  });

  const [activeColorTheme, setActiveColorTheme] = useState(function () {
    const savedTheme = localStorage.getItem(localStorageColorThemeKey);

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [currentActiveSetting, setCurrentActiveSetting] = useState(function () {
    const savedActiveSetting = localStorage.getItem(
      localStorageSavedActiveSettingKey
    );

    return savedActiveSetting ? JSON.parse(savedActiveSetting) : "color-theme";
  });

  const [fontThemePreference, setFontThemePreference] = useState(function () {
    return localStorage.getItem(localStorageFontThemeKey) || "sans-serif";
  });

  const [activeFontTheme, setActiveFontTheme] = useState(fontThemePreference);

  const [inputValue, setInputValue] = useState(function () {
    if (currentActiveSetting === "color-theme") {
      return colorThemePreference;
    } else {
      return fontThemePreference;
    }
  });

  const handleGettingIntoSettings = function (settingType) {
    if (settingType === "color-theme") {
      setInputValue(colorThemePreference);
    } else {
      setInputValue(fontThemePreference);
    }
  };

  useEffect(
    function () {
      setActiveFontTheme(fontThemePreference);
    },
    [fontThemePreference]
  );

  useEffect(
    function () {
      document.documentElement.className = `${activeColorTheme} ${activeFontTheme} ${"font-selectedFont"} ${
        activeColorTheme === "dark" && !allNotesPage ? "allNotesPage" : ""
      }`;
    },
    [activeColorTheme, allNotesPage, activeFontTheme]
  );

  useEffect(
    function () {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleSystemThemeChanges = function () {
        if (colorThemePreference === "system") {
          setActiveColorTheme(mediaQuery.matches ? "dark" : "light");
        }
      };

      if (colorThemePreference === "system") {
        setActiveColorTheme(mediaQuery.matches ? "dark" : "light");

        mediaQuery.addEventListener("change", handleSystemThemeChanges);
      } else {
        setActiveColorTheme(colorThemePreference);
      }

      //Cleanup function for event listsener
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChanges);
      };
    },
    [colorThemePreference]
  );

  const value = {
    uiPage,
    setUiPage,
    onGettingIntoSettings: handleGettingIntoSettings,
    inputValue,
    setInputValue,
    activeColorTheme,
    colorThemePreference,
    setColorThemePreference,
    activeFontTheme,
    fontThemePreference,
    setFontThemePreference,
    currentActiveSetting,
    setCurrentActiveSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const context = useContext(SettingsContext);

  if (context === undefined)
    throw new Error(
      "You're using a settings context outside of the settings provider"
    );

  return context;
}

export { SettingsProvider, useSettings };
