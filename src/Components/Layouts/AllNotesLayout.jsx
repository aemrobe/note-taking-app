import { Outlet, useLocation } from "react-router";
import { useNotes } from "../../Context/NoteContext";
import useResponsiveRedirect from "../../Hooks/useResponsiveRedirect";
import AllNotes from "../../pages/AllNotes";
import { FilteredNotesProvider } from "../../Context/FilteredNotesContext";
import { useMemo } from "react";

function AllNotesLayout() {
  const { notes, isSmallerScreenSize } = useNotes();
  const location = useLocation();
  const isDetailView = location.pathname.split("/").length > 2;

  const notesToDisplay = useMemo(
    function () {
      return notes.filter((note) => !note.isArchived);
    },
    [notes]
  );

  useResponsiveRedirect(notesToDisplay);

  return (
    <FilteredNotesProvider notes={notesToDisplay}>
      {isSmallerScreenSize ? (
        <Outlet />
      ) : (
        <>
          <AllNotes />

          {isDetailView && <Outlet />}
        </>
      )}
    </FilteredNotesProvider>
  );
}

export default AllNotesLayout;
