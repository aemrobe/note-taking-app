import { useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

export const useNoteNavigation = function () {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const navigateToFirstNote = useCallback(
    (targetPath, notesToDisplay) => {
      const basePath = location.pathname.split("/")[1];
      let firstNote;
      if (notesToDisplay.length > 0) {
        firstNote = notesToDisplay[0].title;
      }

      const newPath =
        notesToDisplay.length > 0
          ? `${targetPath}/${firstNote}`
          : `${targetPath}`;

      const searchAndTagspage =
        location.pathname.startsWith("/search") ||
        location.pathname.startsWith("/tags");

      const navigateOptions = {
        pathname: newPath,
      };

      if (searchAndTagspage) {
        const currentSearchString = searchParams.toString();

        if (currentSearchString) {
          navigateOptions.search = currentSearchString;
        }
      }

      const targetUrl =
        newPath + (navigateOptions.search ? `?${navigateOptions.search}` : "");
      const currentUrl =
        decodeURIComponent(location.pathname) + location.search;

      let fromState = `/${basePath}`;
      if (searchAndTagspage) {
        fromState += location.search;
      }

      if (currentUrl !== targetUrl) {
        navigate(navigateOptions, {
          state: {
            from: fromState,
          },
          replace: true,
        });
      }
    },
    [location.pathname, location.search, navigate, searchParams]
  );

  return navigateToFirstNote;
};
