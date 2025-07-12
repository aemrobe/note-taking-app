import { useSettings } from "../Context/SettingsContext";

import ArrowLeftIcon from "../Components/ArrowLeftIcon";
import SystemIcon from "../Components/SystemIcon";
import SunIcon from "../Components/SunIcon";
import MoonIcon from "../Components/MoonIcon";
import { NavLink, useParams } from "react-router";
import { SETTING_TYPES_MAP } from "../config/constants";

function SettingsDetailsPage() {
  const { inputValue, setInputValue, ...settingsContext } = useSettings();

  const { settingType } = useParams();

  const currentSetting = SETTING_TYPES_MAP[settingType];

  const { title, description, options } = currentSetting;

  const handleApplyChanges = function (e) {
    e.preventDefault();
    currentSetting.setPreference(settingsContext, inputValue);
  };

  return (
    <form className="pt-6" onSubmit={handleApplyChanges}>
      <NavLink
        to={"/settings"}
        className="flex space-x-2 items-center text-sm font-medium -tracking-50 text-neutral600"
      >
        <ArrowLeftIcon width={"w-5"} />
        <p>Settings</p>
      </NavLink>

      <h3 className="font-bold text-2xl -tracking-150 mt-3 mb-2 text-neutral950">
        {title}
      </h3>

      <p className="text-neutral700 text-sm leading-50 -tracking-50 mb-5">
        {description}
      </p>

      <div className="relative flex flex-col space-y-4">
        {options.map((option) => (
          <RadioButton option={option} key={option.title} />
        ))}
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
        className={`flex space-x-4 items-center border border-neutral200 rounded-xl p-4 bg-transparent peer-checked:bg-neutral100 peer-checked:[&>span:nth-child(3)]:border-blue500 peer-checked:[&>span:nth-child(3)]:border-4`}
      >
        <span className="border border-neutral200 rounded-xl bg-white p-2">
          <Icon width={"w-6"} />
        </span>

        <span className="flex flex-col mr-auto space-y-1.5">
          <span className="font-medium text-sm -tracking-50 text-neutral950 capitalize">
            {title}
          </span>
          <span className="text-xs -tracking-50 text-neutral700">{text}</span>
        </span>

        <span className="border-2 border-neutral200 rounded-full w-4 h-4"></span>

        {/* <span className="border-4 border-blue500 rounded-full w-4 h-4"></span> */}
      </label>
    </div>
  );
}

export default SettingsDetailsPage;
