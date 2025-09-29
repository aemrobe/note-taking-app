import { useCallback, useEffect } from "react";
import ListOfNotes from "../Components/ListOfNotes";

import { APP_NAME } from "../config/constants";
import { useFilteredNotes } from "../Context/FilteredNotesContext";
import { useLocation } from "react-router";

function ArchivedNotes() {
  const { notes: notesToDisplay } = useFilteredNotes();
  const location = useLocation();

  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  useEffect(() => {
    document.title = `${
      pathMatch("/archived-notes/new") ? "Create New Note" : "Archived Notes"
    } - ${APP_NAME}`;
  }, [pathMatch]);

  return (
    <>
      <ListOfNotes
        type={"Archived Notes"}
        notes={notesToDisplay}
        parentPath={"/archived-notes"}
      />
    </>
  );
}

export default ArchivedNotes;
