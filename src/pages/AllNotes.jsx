import { useEffect } from "react";
import ListOfNotes from "../Components/ListOfNotes";
import { useNotes } from "../Context/NoteContext";
import { APP_NAME } from "../config/constants";

function AllNotes() {
  const { notes } = useNotes();

  const allNotesNotArchived = notes.filter((note) => note.isArchived === false);

  useEffect(() => {
    document.title = `All Notes - ${APP_NAME}`;
  }, []);

  return <ListOfNotes type={"All Notes"} notes={allNotesNotArchived} />;
}

export default AllNotes;
