import FontMonoSpaceIcon from "../Components/icons/FontMonoSpaceIcon";
import FontSansSerifIcon from "../Components/icons/FontSansSerifIcon";
import FontSerifIcon from "../Components/icons/FontSerifIcon";
import MoonIcon from "../Components/icons/MoonIcon";
import SunIcon from "../Components/icons/SunIcon";
import SystemIcon from "../Components/icons/SystemIcon";

export const localStorageTagKey = "selectedTags";
export const localStorageColorThemeKey = "colorTheme";
export const localStorageFontThemeKey = "fontTheme";
export const localStorageNotesKey = "notes";
export const localStorageDetailsOfNotesDraft = "detailOfNotesDraftContent";
export const localStorageCreateNewNoteDraft = "CreateNewNoteDraft";
export const localStorageSavedActiveSettingKey = "active-setting";

export const XL_BREAKPOINT_REM = 80;
export const TOAST_DURATION_MS = 4000; //4 sec
export const TOAST_ANIMATION_DURATION = 500; //0.5 sec
export const SEARCH_DEBOUNCE_DELAY_MS = 500;
export const APP_NAME = "Notes App";

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
    name: "color-theme",
    text: "Select a sleek and modern dark theme",
  },
  {
    title: "System",
    type: "system",
    icon: SystemIcon,
    name: "color-theme",
    text: "Adapts to your device's theme",
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
