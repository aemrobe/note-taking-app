import { NavLink } from "react-router";
import ArrowRightIcon from "./ArrowRightIcon";

function DesktopNavigationLink({ children, title, path }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `focusable-ring py-2.5 pl-3 flex items-center space-x-2 rounded-lg ${
          isActive ? "bg-desktop-navigation-link-background-active" : ""
        }`
      }
      to={`${path}`}
    >
      {({ isActive }) => (
        <>
          <span
            className={`${
              isActive
                ? "text-blue500"
                : "text-desktop-navigation-link-text-default"
            }`}
          >
            {children}
          </span>
          <span
            className={`text-sm -tracking-50 ${
              isActive
                ? "text-desktop-navigation-link-text-active"
                : "text-desktop-navigation-link-text-default"
            }`}
          >
            {title}
          </span>
          {isActive && (
            <span className="ml-auto text-text-primary">
              <ArrowRightIcon width={"w-6"} />
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default DesktopNavigationLink;
//
