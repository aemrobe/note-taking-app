import ListOfNotes from "../Components/ListOfNotes";

import { useNotes } from "../Context/NoteContext";

function ArchivedNotes() {
  const { notes } = useNotes();

  const ArchivedNotes = notes.filter((note) => note.isArchived === true);

  return (
    <>
      <ListOfNotes type={"Archived Notes"} notes={ArchivedNotes} />
    </>
  );
}

export default ArchivedNotes;
