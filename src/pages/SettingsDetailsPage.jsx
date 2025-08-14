import { useSettings } from "../Context/SettingsContext";

import ArrowLeftIcon from "../Components/ArrowLeftIcon";
import { NavLink, useParams } from "react-router";
import { APP_NAME, SETTING_TYPES_MAP } from "../config/constants";
import { useToast } from "../Context/ToastContext";
import { useEffect, useRef } from "react";

function SettingsDetailsPage() {
  const { inputValue, ...settingsContext } = useSettings();
  const { handleShowToastMessage } = useToast();

  const { settingType } = useParams();

  const pageTitle = useRef(null);

  useEffect(function () {
    pageTitle.current.focus();
  }, []);

  useEffect(() => {
    document.title = `${settingType
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ")} - Settings - ${APP_NAME}`;

    return () => {
      document.title = `Settings - ${APP_NAME}`;
    };
  }, [settingType]);

  const currentSetting = SETTING_TYPES_MAP[settingType];

  const { title, description, options } = currentSetting;

  const handleApplyChanges = function (e) {
    e.preventDefault();
    currentSetting.setPreference(settingsContext, inputValue);
    handleShowToastMessage({ text: "Settings updated successfully!" });
  };

  return (
    <form className="pt-6" onSubmit={handleApplyChanges}>
      <NavLink
        to={"/settings"}
        className="flex space-x-2 items-center text-sm text-font-medium -tracking-50 text-back-to-settings-button-text focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2 "
        aria-label="Go to main settings"
      >
        <ArrowLeftIcon width={"w-5"} />
        <p>Settings</p>
      </NavLink>

      <h1
        ref={pageTitle}
        tabIndex={-1}
        className="font-bold text-2xl -tracking-150 mt-3 mb-2 text-text-primary focus:outline-none"
      >
        {title}
      </h1>

      <p className="text-setting-option-description-text text-sm leading-50 -tracking-50 mb-5">
        {description}
      </p>

      <div className="relative flex flex-col space-y-4">
        {options.map((option) => (
          <RadioButton option={option} key={option.title} />
        ))}
      </div>

      <button
        type="submit"
        className="bg-settings-apply-button-background text-settings-apply-button-text py-3 px-4 rounded-lg mt-5 ml-auto block text-sm font-medium -tracking-50 focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2"
      >
        Apply Changes
      </button>
    </form>
  );
}

function RadioButton({ option }) {
  const { inputValue, setInputValue } = useSettings();
  const { title, icon: Icon, text, type, name } = option;

  return (
    <div>
      <input
        type="radio"
        className="absolute bottom-0 left-0 w-0 h-0 opacity-0 peer"
        value={type}
        name={name}
        id={`${type}`}
        checked={inputValue === type}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <label
        htmlFor={`${type}`}
        className={`flex space-x-4 items-center border border-radio-button-border rounded-xl p-4 bg-transparent peer-checked:bg-radio-button-checked-background peer-checked:[&>span:nth-child(3)]:border-radio-button-indicator-checked-border peer-checked:[&>span:nth-child(3)]:border-4`}
      >
        <span className="border border-radio-button-icon-wrapper-border text-radio-button-icon rounded-xl bg-radio-button-icon-wrapper-background p-2">
          <Icon width={"w-6"} />
        </span>

        <span className="flex flex-col mr-auto space-y-1.5">
          <span className="font-medium text-sm -tracking-50 text-radio-button-title-text capitalize">
            {title}
          </span>
          <span className="text-xs -tracking-50 text-radio-button-description-text">
            {text}
          </span>
        </span>

        <span className="border-2 border-radio-button-indicator-border rounded-full w-4 h-4"></span>
      </label>
    </div>
  );
}

export default SettingsDetailsPage;
