import FontIcon from "../Components/FontIcon";
import SunIcon from "../Components/SunIcon";
import { useSettings } from "../Context/SettingsContext";
import { NavLink } from "react-router";

function SettingsPage() {
  return (
    <div>
      <h2 className="font-bold text-2xl text-text-primary  -tracking-150 mt-6 mb-4">
        Settings
      </h2>

      <ul className="text-sm font-medium -tracking-50 text-setting-option-text flex flex-col space-y-2">
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
  );
}

function SettingItem({ children, type }) {
  const { onGettingIntoSettings } = useSettings();

  return (
    <li>
      <NavLink
        to={`${type}`}
        className="py-2 w-full flex space-x-2 items-center"
        onClick={() => onGettingIntoSettings(type)}
      >
        {children}
      </NavLink>
    </li>
  );
}

export default SettingsPage;
