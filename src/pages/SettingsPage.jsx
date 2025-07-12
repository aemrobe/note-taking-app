import { useState } from "react";
import FontIcon from "../Components/FontIcon";
import SettingIcon from "../Components/SettingIcon";
import SunIcon from "../Components/SunIcon";
import MoonIcon from "../Components/MoonIcon";
import { useSettings } from "../Context/SettingsContext";
import ArrowLeftIcon from "../Components/ArrowLeftIcon";
import SystemIcon from "../Components/SystemIcon";
import { useTheme } from "../Context/ThemeContext";
import { NavLink } from "react-router";

function SettingsPage() {
  const { uiPage, setUiPage, inputValue, setThemePreference } = useSettings();

  console.log("uiPage", uiPage);

  const handleThemeSwitcher = function (theme) {
    setThemePreference(theme);
    localStorage.setItem("theme", theme);
  };

  return uiPage === "settingsPage" ? (
    <div>
      <h2 className="font-bold text-2xl -tracking-150 mt-6 mb-4">Settings</h2>

      <ul className="text-sm font-medium -tracking-50 text-neutral950 flex flex-col space-y-2">
        <SettingItem type={"color-theme"}>
          <SunIcon width={"w-5"} />
          <span>Color Theme</span>
        </SettingItem>

        <SettingItem type={"font-theme"}>
          <FontIcon width={"w-5"} />
          <span>Font Theme</span>
        </SettingItem>
      </ul>
    </div>
  ) : (
    <form
      className="pt-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleThemeSwitcher(inputValue);
      }}
    >
      <button
        className="flex space-x-2 items-center text-sm font-medium -tracking-50 text-neutral600"
        onClick={() => setUiPage("settingsPage")}
      >
        <ArrowLeftIcon width={"w-5"} />
        <p>Settings</p>
      </button>

      <h3 className="font-bold text-2xl -tracking-150 mt-3 mb-2 text-neutral950">
        Color Theme
      </h3>

      <p className="text-neutral700 text-sm leading-50 -tracking-50 mb-5">
        Choose your color theme:
      </p>

      <div className="relative flex flex-col space-y-4">
        <RadioButton
          themeType={"light"}
          defaultChecked={true}
          icon={<SunIcon width={"w-6"} />}
          text="Pick a clean and classic light theme"
        />
        <RadioButton
          themeType={"dark"}
          icon={<MoonIcon width={"w-6"} />}
          text="Select a sleek and modern dark theme"
        />
        <RadioButton
          themeType={"system"}
          icon={<SystemIcon width={"w-6"} />}
          text="Adapts to your device’s theme"
        />
      </div>

      <button
        type="submit"
        className="bg-blue500 text-white py-3 px-4 rounded-lg mt-5 ml-auto block text-sm font-medium -tracking-50"
      >
        Apply Changes
      </button>
    </form>
  );
}
// SystemIcon  MoonIcon
function RadioButton({ themeType, icon, mode, text, defaultChecked = false }) {
  const { inputValue, setInputValue } = useSettings();

  console.log("input", inputValue);

  console.log(inputValue === themeType);
  return (
    <div>
      <input
        type="radio"
        className="absolute bottom-0 left-0 w-0 h-0 opacity-0 peer"
        value={themeType}
        name="color-theme"
        id={`${themeType}`}
        checked={inputValue === themeType}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <label
        htmlFor={`${themeType}`}
        className={`flex space-x-4 items-center border border-neutral200 rounded-xl p-4 bg-transparent peer-checked:bg-neutral100 peer-checked:[&>span:nth-child(3)]:border-blue500 peer-checked:[&>span:nth-child(3)]:border-4`}
      >
        <span className="border border-neutral200 rounded-xl bg-white p-2">
          {icon}
        </span>

        <span className="flex flex-col mr-auto space-y-1.5">
          <span className="font-medium text-sm -tracking-50 text-neutral950 capitalize">
            {themeType} Mode
          </span>
          <span className="text-xs -tracking-50 text-neutral700">{text}</span>
          <SunIcon width={"w-6"} />
        </span>

        <span className="border-2 border-neutral200 rounded-full w-4 h-4"></span>

        {/* <span className="border-4 border-blue500 rounded-full w-4 h-4"></span> */}
      </label>
    </div>
  );
}

function SettingItem({ children, type }) {
  const { onGettingIntoSettings } = useSettings();

  return (
    <li>
      <NavLink
        to={`${type}`}
        className="py-2 w-full flex space-x-2 items-center  "
        onClick={() => onGettingIntoSettings(type)}
      >
        {children}
      </NavLink>
    </li>
  );
}

export default SettingsPage;
