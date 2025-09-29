import { useCallback, useEffect } from "react";
import ListOfNotes from "../Components/ListOfNotes";
import { APP_NAME } from "../config/constants";
import { useLocation } from "react-router";
import { useFocus } from "../Context/FocusContext";
import { useFilteredNotes } from "../Context/FilteredNotesContext";
import { useNotes } from "../Context/NoteContext";

function AllNotes() {
  const location = useLocation();
  const { lastFocusableElement } = useNotes();
  const { notes } = useFilteredNotes();
  const { setFocus } = useFocus();
  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  console.log("lastfocusableelement", lastFocusableElement);

  useEffect(() => {
    document.title = `${
      pathMatch("/all-notes/new") ? "Create New Note" : "All Notes"
    } - ${APP_NAME}`;

    if (location.state && location.state.fromCreateNote) {
      setTimeout(() => {
        setFocus();
      }, 100);

      window.history.replaceState({}, document.title);
    }
  }, [location.state, setFocus, pathMatch]);

  return (
    <ListOfNotes type={"All Notes"} notes={notes} parentPath={"/all-notes"} />
  );
}

export default AllNotes;
