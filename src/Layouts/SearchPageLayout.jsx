import { Outlet } from "react-router";
import { useNotes } from "../Context/NoteContext";
import SearchPage from "../pages/SearchPage";
import { useSearch } from "../Context/SearchContext";
import useResponsiveRedirect from "../Hooks/useResponsiveRedirect";
import { useEffect, useState } from "react";
import { useNoteNavigation } from "../Hooks/useNoteNavigation";

function SearchPageLayout() {
  const { isSmallerScreenSize } = useNotes();
  const isDetailView = location.pathname.split("/").length > 2;
  const { filteredNotes, actualSearchQueryFromURL } = useSearch();
  const basePath = location.pathname.split("/")[1];

  const [lastSearchQuery, setLastSearchQuery] = useState(
    actualSearchQueryFromURL
  );

  useEffect(() => {
    // Determine if the search query has changed since the last render
    if (lastSearchQuery !== actualSearchQueryFromURL) {
      setLastSearchQuery(actualSearchQueryFromURL);
    }
  }, [actualSearchQueryFromURL, lastSearchQuery]);

  const navigateToFirstNote = useNoteNavigation();

  useResponsiveRedirect(filteredNotes);

  useEffect(
    function () {
      const hasDetailView = location.pathname.split("/").length > 2;

      if (
        !isSmallerScreenSize &&
        hasDetailView &&
        lastSearchQuery !== actualSearchQueryFromURL &&
        !location.pathname.includes("/new")
      ) {
        if (filteredNotes.length > 0) {
          const firstNoteInList = filteredNotes[0].title;
          const currentNoteTitle = location.pathname.split("/").pop();
          if (firstNoteInList !== currentNoteTitle) {
            navigateToFirstNote(`/${basePath}`, filteredNotes);
          }
        } else {
          navigateToFirstNote(`/${basePath}`, filteredNotes);
        }
      }
    },
    [
      lastSearchQuery,
      isSmallerScreenSize,
      navigateToFirstNote,
      filteredNotes,
      basePath,
      actualSearchQueryFromURL,
    ]
  );

  return (
    <>
      {isSmallerScreenSize ? (
        <Outlet />
      ) : (
        <>
          <SearchPage />

          {isDetailView && <Outlet />}
        </>
      )}
    </>
  );
}

export default SearchPageLayout;
