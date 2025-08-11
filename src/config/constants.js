import FontMonoSpaceIcon from "../Components/FontMonoSpaceIcon";
import FontSansSerifIcon from "../Components/FontSansSerifIcon";
import FontSerifIcon from "../Components/FontSerifIcon";
import MoonIcon from "../Components/MoonIcon";
import SunIcon from "../Components/SunIcon";
import SystemIcon from "../Components/SystemIcon";

export const localStorageTagKey = "selectedTags";
export const localStorageColorThemeKey = "colorTheme";
export const localStorageFontThemeKey = "fontTheme";
export const localStorageDetailsOfNotesDraft = "detailOfNotesDraftContent";
export const APP_NAME = "Notes App";
export const formatDate = function (date) {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const COLOR_THEME_OPTIONS = [
  {
    title: "Light Mode",
    type: "light",
    icon: SunIcon,
    name: "color-theme",
    text: "Pick a clean and classic light theme",
  },
  {
    title: "Dark Mode",
    type: "dark",
    icon: MoonIcon,
    text: "Select a sleek and modern dark theme",
  },
  {
    title: "System",
    type: "system",
    icon: SystemIcon,
    text: "Select a sleek and modern dark theme",
  },
];

export const FONT_THEME_OPTIONS = [
  {
    title: "Sans-serif",
    type: "sans-serif",
    icon: FontSansSerifIcon,
    name: "font-theme",
    text: "Clean and modern, easy to read.",
  },
  {
    title: "Serif",
    type: "serif",
    icon: FontSerifIcon,
    name: "font-theme",
    text: "Classic and elegant for a timeless feel.",
  },
  {
    title: "Monospace",
    type: "monsospace",
    icon: FontMonoSpaceIcon,
    name: "font-theme",
    text: "Code-like, great for a technical vibe.",
  },
];

export const SETTING_TYPES_MAP = {
  "color-theme": {
    title: "Color Theme",
    description: "Choose you color theme",
    options: COLOR_THEME_OPTIONS,
    getPreference: (settings) => settings.colorThemePreference,
    setPreference: (settings, value) => {
      settings.setColorThemePreference(value);
      localStorage.setItem("colorTheme", value);
    },
  },

  "font-theme": {
    title: "Font Theme",
    description: "Choose you font theme",
    options: FONT_THEME_OPTIONS,
    getPreference: (settings) => settings.fontThemePreference,
    setPreference: (settings, value) => {
      settings.setFontThemePreference(value);
      localStorage.setItem("fontTheme", value);
    },
  },
};
