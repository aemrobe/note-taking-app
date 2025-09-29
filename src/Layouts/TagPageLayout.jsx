import { Outlet, useLocation, useNavigate } from "react-router";
import { useTag } from "../Context/TagContext";
import TagsPage from "../pages/TagsPage";
import { useNotes } from "../Context/NoteContext";
import { useEffect, useState } from "react";
import { useNoteNavigation } from "../Hooks/useNoteNavigation";
import useResponsiveRedirect from "../Hooks/useResponsiveRedirect";

function TagPageLayout() {
  const navigateToFirstNote = useNoteNavigation();
  const location = useLocation();
  const { filteredNotes, selectedTags } = useTag();
  const { isSmallerScreenSize } = useNotes();
  const basePath = location.pathname.split("/")[1];
  const isDetailView = location.pathname.split("/").length > 2;
  const navigate = useNavigate();

  const [lastSelectedTags, setLastSelectedTags] = useState(selectedTags);
  const hasTagsChanged =
    JSON.stringify(selectedTags) !== JSON.stringify(lastSelectedTags);

  useResponsiveRedirect(filteredNotes);

  // Now, update the tags and navigate to the new url for the desktop view
  useEffect(
    function () {
      if (
        !isSmallerScreenSize &&
        location.pathname.startsWith("/tags") &&
        hasTagsChanged &&
        isDetailView
      ) {
        const currentNoteTitleInURl = decodeURIComponent(
          location.pathname.split("/").pop()
        );

        const firstFilteredNote = filteredNotes[0];

        if (
          filteredNotes.length > 0 &&
          firstFilteredNote &&
          currentNoteTitleInURl !== firstFilteredNote.title
        ) {
          navigateToFirstNote(`/${basePath}`, filteredNotes);
        } else {
          navigateToFirstNote(`/${basePath}`, filteredNotes);
        }

        setLastSelectedTags(selectedTags);
      }
    },
    [
      hasTagsChanged,
      isDetailView,
      lastSelectedTags,
      selectedTags,
      filteredNotes,
      isSmallerScreenSize,
      location.pathname,
      location.search,
      navigate,
      basePath,
      navigateToFirstNote,
    ]
  );

  return (
    <>
      {isSmallerScreenSize ? (
        <Outlet />
      ) : (
        <>
          <TagsPage />
          {isDetailView && <Outlet />}
        </>
      )}
    </>
  );
}

export default TagPageLayout;
