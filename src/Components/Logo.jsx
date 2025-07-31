import { useSettings } from "../Context/SettingsContext";
import LogoIcon from "./LogoIcon";

function Logo() {
  const { activeColorTheme } = useSettings();

  return (
    <div
      className="
      bg-logo-background text-logo-icon py-[0.865rem] px-[1.021rem]"
    >
      <LogoIcon />
    </div>
  );
}

export default Logo;
