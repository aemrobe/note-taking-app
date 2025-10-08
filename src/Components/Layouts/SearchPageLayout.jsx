import { Outlet } from "react-router";
import { useNotes } from "../../Context/NoteContext";
import SearchPage from "../../pages/SearchPage";
import { useSearch } from "../../Context/SearchContext";
import useResponsiveRedirect from "../../Hooks/useResponsiveRedirect";
import { useEffect, useState } from "react";
import { useNoteNavigation } from "../../Hooks/useNoteNavigation";

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
      if (
        !isSmallerScreenSize &&
        isDetailView &&
        lastSearchQuery !== actualSearchQueryFromURL &&
        !location.pathname.includes("/new")
      ) {
        navigateToFirstNote(`/${basePath}`, filteredNotes);
      }
    },
    [
      lastSearchQuery,
      isSmallerScreenSize,
      navigateToFirstNote,
      filteredNotes,
      basePath,
      actualSearchQueryFromURL,
      isDetailView,
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
