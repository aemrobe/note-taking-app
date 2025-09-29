import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useNotes } from "../Context/NoteContext";
import { useTag } from "../Context/TagContext";
import { useNoteNavigation } from "./useNoteNavigation";

function useResponsiveRedirect(notesToDisplay) {
  const { isSmallerScreenSize } = useNotes();
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedTags, filteredNotes: filteredNoteByTag } = useTag();

  const navigateToFirstNote = useNoteNavigation();

  useEffect(() => {
    if (location.pathname.endsWith("/new")) {
      return;
    }

    const hasDetailView = location.pathname.split("/").length > 2;

    if (!isSmallerScreenSize && !hasDetailView) {
      navigateToFirstNote(`/${basePath}`, notesToDisplay);
      return;
    }
  }, [
    selectedTags.length,
    isSmallerScreenSize,
    searchParams,
    navigate,
    navigateToFirstNote,
    location.pathname,
    location.search,
    notesToDisplay,
    basePath,
  ]);
}

export default useResponsiveRedirect;
