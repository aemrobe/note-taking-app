import { useEffect, useRef } from "react";
import FontIcon from "../Components/FontIcon";
import SunIcon from "../Components/SunIcon";
import { useSettings } from "../Context/SettingsContext";
import { NavLink } from "react-router";
import { APP_NAME } from "../config/constants";
import ArrowRightIcon from "../Components/ArrowRightIcon";
import { useNotes } from "../Context/NoteContext";

function SettingsPage() {
  const pageTitle = useRef(null);
  const { isSmallerScreenSize } = useNotes();
  const { currentActiveSetting, setCurrentActiveSetting } = useSettings();

  useEffect(
    function () {
      pageTitle.current?.focus();
    },
    [pageTitle]
  );

  useEffect(() => {
    document.title = `Settings - ${APP_NAME}`;
  }, []);

  return (
    <div
      className="md:w-full
     md:max-w-[43.75rem] md:mx-auto xl:mx-0 xl:max-w-none xl:pt-5  xl:pr-4 xl:pl-8 xl:border-r border-border-separator"
    >
      {isSmallerScreenSize && (
        <h1
          ref={pageTitle}
          tabIndex={-1}
          className="font-bold focus:outline-none text-2xl text-text-primary  -tracking-150 mt-6 mb-4"
        >
          Settings
        </h1>
      )}

      <ul className="text-sm font-medium -tracking-50 text-setting-option-text flex flex-col space-y-2">
        <SettingItem
          type={"color-theme"}
          currentActiveSetting={currentActiveSetting}
          onSetCurrentActiveSetting={setCurrentActiveSetting}
          icon={<SunIcon width={"w-5"} />}
        >
          <span>Color Theme</span>
        </SettingItem>

        <SettingItem
          type={"font-theme"}
          currentActiveSetting={currentActiveSetting}
          onSetCurrentActiveSetting={setCurrentActiveSetting}
          icon={<FontIcon width={"w-5"} />}
        >
          <span>Font Theme</span>
        </SettingItem>
      </ul>
    </div>
  );
}

function SettingItem({
  children,
  type,
  currentActiveSetting,
  onSetCurrentActiveSetting,
  icon,
}) {
  const { isSmallerScreenSize } = useNotes();
  const { onGettingIntoSettings } = useSettings();
  const { activeColorTheme } = useSettings();
  const isActive = type === currentActiveSetting;

  const handleChangeSetting = function () {
    onGettingIntoSettings(type);
    onSetCurrentActiveSetting(type);
    localStorage.setItem("active-setting", JSON.stringify(type));
  };

  return (
    <li>
      <NavLink
        to={`${type}`}
        className={`py-2 xl:p-2 w-full flex space-x-2 items-center focusable-ring xl:w-[13.125rem] ${
          isActive ? "xl:bg-desktop-navigation-link-background-active" : ""
        } xl:rounded-md`}
        onClick={handleChangeSetting}
      >
        <span
          className={`${
            !isSmallerScreenSize && isActive && activeColorTheme === "dark"
              ? "text-blue500"
              : ""
          }`}
        >
          {icon}
        </span>

        {children}
        {
          <span
            className={`hidden ${
              activeColorTheme === "light" && isActive ? "md:block" : ""
            } ${!isSmallerScreenSize && isActive ? "xl:block" : ""} ml-auto`}
          >
            <ArrowRightIcon width={"w-6"} />
          </span>
        }
      </NavLink>
    </li>
  );
}

export default SettingsPage;
