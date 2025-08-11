import { NavLink } from "react-router";
import ArchiveIcon from "./ArchiveIcon";
import HomeIcon from "./HomeIcon";
import SearchIcon from "./SearchIcon";
import SettingIcon from "./SettingIcon";
import TagIcon from "./TagIcon";

function MobileMenu({ currentSearchParams = "" }) {
  return (
    <nav>
      <ul className="w-full bg-background-primary z-20 border-t border-border-menubar shadow-[0_-2px_2px_var(--color-shadow-level-1)] text-icon-navigation-default py-3 px-4 fixed bottom-0 flex justify-center">
        <MobileMenuLinks path={"/all-notes"} label={"All Notes"}>
          <HomeIcon />
        </MobileMenuLinks>

        <MobileMenuLinks path={"/search"} label={"Search Notes"}>
          <SearchIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks path="/archived-notes" label={"Archived Notes"}>
          <ArchiveIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks
          path="/tags"
          params={currentSearchParams}
          label={"Tags"}
        >
          <TagIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks path="/settings" label={"Settings"}>
          <SettingIcon />
        </MobileMenuLinks>
      </ul>
    </nav>
  );
}

function MobileMenuLinks({ children, label, path = "", params = "" }) {
  const fullPath = params ? `${path}?${params}` : path;

  return (
    <li>
      <NavLink
        aria-label={label}
        to={fullPath}
        className={({ isActive }) =>
          `block py-1 px-[1.39375rem] focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2  rounded ${
            isActive ? "bg-background-navigation-active" : ""
          } ${isActive ? "text-icon-navigation-active" : ""}`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

export default MobileMenu;
