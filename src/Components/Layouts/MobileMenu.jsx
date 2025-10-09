import { NavLink, useLocation } from "react-router";
import ArchiveIcon from "../icons/ArchiveIcon";
import HomeIcon from "../icons/HomeIcon";
import SearchIcon from "../icons/SearchIcon";
import SettingIcon from "../icons/SettingIcon";
import TagIcon from "../icons/TagIcon";

function MobileMenu({ currentSearchParams = "" }) {
  return (
    <nav className="w-full bg-background-primary z-20 border-t border-border-menubar shadow-[0_-2px_2px_var(--color-shadow-level-1)] text-icon-navigation-default fixed bottom-0 right-0 left-0">
      <ul className="py-3 px-4 md:px-8 container mx-auto md:w-full md:max-w-[48rem] flex justify-center md:justify-between">
        <MobileMenuLinks
          path={"/all-notes"}
          label={"View All Notes"}
          text={"Home"}
        >
          <HomeIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks
          path={"/search"}
          label={"Search Notes"}
          text={"Search"}
        >
          <SearchIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks
          path="/archived-notes"
          label={"View Archived Notes"}
          text={"Archived"}
        >
          <ArchiveIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks
          path="/tags"
          params={currentSearchParams}
          label={"Visit Tags page"}
          text={"Tags"}
        >
          <TagIcon width={"w-6"} />
        </MobileMenuLinks>

        <MobileMenuLinks
          path="/settings"
          label={"Visit Settings page"}
          text={"Settings"}
        >
          <SettingIcon />
        </MobileMenuLinks>
      </ul>
    </nav>
  );
}

function MobileMenuLinks({ children, label, path = "", params = "", text }) {
  const fullPath = params ? `${path}?${params}` : path;
  const location = useLocation();

  const isItDetailsPage =
    location.pathname.startsWith("/all-notes/") ||
    location.pathname.startsWith("/archived-notes/") ||
    location.pathname.startsWith("/search/") ||
    location.pathname.startsWith("/tags/");

  return (
    <li>
      <NavLink
        aria-label={label}
        to={fullPath}
        className={({ isActive }) =>
          `block md:flex md:flex-col md:space-y-1 md:items-center py-1 px-[1.39375rem] focusable-ring  rounded ${
            isActive && !isItDetailsPage
              ? "bg-background-navigation-active"
              : ""
          } ${
            isActive && !isItDetailsPage ? "text-icon-navigation-active" : ""
          }`
        }
      >
        {children}
        <span className="hidden md:inline text-xs -tracking-50">{text}</span>
      </NavLink>
    </li>
  );
}

export default MobileMenu;
