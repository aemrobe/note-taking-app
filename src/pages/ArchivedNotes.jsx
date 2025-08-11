import { useEffect } from "react";
import ListOfNotes from "../Components/ListOfNotes";

import { useNotes } from "../Context/NoteContext";
import { APP_NAME } from "../config/constants";

function ArchivedNotes() {
  const { notes } = useNotes();

  const ArchivedNotes = notes.filter((note) => note.isArchived === true);

  useEffect(() => {
    document.title = `Archived Notes - ${APP_NAME}`;
  }, []);

  return (
    <>
      <ListOfNotes type={"Archived Notes"} notes={ArchivedNotes} />
    </>
  );
}

export default ArchivedNotes;
