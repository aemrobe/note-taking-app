import { NavLink } from "react-router";
import ArchiveIcon from "./ArchiveIcon";
import HomeIcon from "./HomeIcon";
import SearchIcon from "./SearchIcon";
import SettingIcon from "./SettingIcon";
import TagIcon from "./TagIcon";

function MobileMenu({ currentSearchParams = "" }) {
  return (
    <nav>
      <ul className="border-2 w-full bg-white z-20 border-t border-neutral200 shadow-[0_-2px_2px_rgba(0,0,0,0.05)] text-neutral600 py-3 px-4 fixed bottom-0 flex justify-center">
        <MobileMenuLinks path={"/all-notes"}>
          <HomeIcon />
        </MobileMenuLinks>

        <MobileMenuLinks path={"/search"}>
          <SearchIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks path="/archived-notes">
          <ArchiveIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks path="/tags" params={currentSearchParams}>
          <TagIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks path="/settings">
          <SettingIcon />
        </MobileMenuLinks>
      </ul>
    </nav>
  );
}

function MobileMenuLinks({ children, path = "", params = "" }) {
  const fullPath = params ? `${path}?${params}` : path;

  return (
    <li>
      <NavLink
        to={fullPath}
        className={({ isActive }) =>
          `block py-1 px-[1.39375rem] ${isActive ? "bg-blue50" : ""} ${
            isActive ? "text-blue500" : ""
          }`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

function MobileMenuButtons({ children }) {
  return (
    <li>
      <button className="block py-1 px-[1.39375rem]">{children}</button>
    </li>
  );
}

export default MobileMenu;
