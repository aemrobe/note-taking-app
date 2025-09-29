import { Outlet, useLocation } from "react-router";
import { useNotes } from "../Context/NoteContext";
import ArchivedNotes from "../pages/ArchivedNotes";
import useResponsiveRedirect from "../Hooks/useResponsiveRedirect";
import { FilteredNotesProvider } from "../Context/FilteredNotesContext";

function ArchivedNotesLayout() {
  const { notes, isSmallerScreenSize } = useNotes();

  const location = useLocation();

  const isDetailView = location.pathname.split("/").length > 2;
  const notesTodisplay = notes.filter((note) => note.isArchived);

  useResponsiveRedirect(notesTodisplay);

  return (
    <FilteredNotesProvider notes={notesTodisplay}>
      {isSmallerScreenSize ? (
        <Outlet />
      ) : (
        <>
          <ArchivedNotes />

          {isDetailView && <Outlet />}
        </>
      )}
    </FilteredNotesProvider>
  );
}

export default ArchivedNotesLayout;
