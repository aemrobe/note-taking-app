import { useEffect } from "react";
import ListOfNotes from "../Components/ListOfNotes";
import { useNotes } from "../Context/NoteContext";
import { APP_NAME } from "../config/constants";
import { useLocation } from "react-router";
import { useFocus } from "../Context/FocusContext";

function AllNotes() {
  const { notes } = useNotes();
  const location = useLocation();
  const allNotesNotArchived = notes.filter((note) => note.isArchived === false);
  const { setFocus, createNewNoteButtonRef } = useFocus();

  console.log("createnewnote", createNewNoteButtonRef);
  useEffect(() => {
    document.title = `All Notes - ${APP_NAME}`;

    // console.log("fromCreatenote", location.state.fromCreateNote);

    if (location.state && location.state.fromCreateNote) {
      setTimeout(() => {
        setFocus();
      }, 100);

      window.history.replaceState({}, document.title);
    }
  }, [location.state, setFocus]);

  return <ListOfNotes type={"All Notes"} notes={allNotesNotArchived} />;
}

export default AllNotes;
