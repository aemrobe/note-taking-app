import { useCallback, useEffect } from "react";
import ListOfNotes from "../Components/ListOfNotes";
import { APP_NAME } from "../config/constants";
import { useLocation } from "react-router";
import { useFilteredNotes } from "../Context/FilteredNotesContext";

function AllNotes() {
  const location = useLocation();
  const { notes } = useFilteredNotes();
  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  useEffect(() => {
    document.title = `${
      pathMatch("/all-notes/new") ? "Create New Note" : "All Notes"
    } - ${APP_NAME}`;
  }, [location.state, pathMatch]);

  return (
    <ListOfNotes type={"All Notes"} notes={notes} parentPath={"/all-notes"} />
  );
}

export default AllNotes;
