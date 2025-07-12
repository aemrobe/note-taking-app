import ListOfNotes from "../Components/ListOfNotes";
import { useNotes } from "../Context/NoteContext";

function Allnotes() {
  const { notes } = useNotes();

  const allNotesNotArchived = notes.filter((note) => note.isArchived === false);

  return <ListOfNotes type={"All Notes"} notes={allNotesNotArchived} />;
}

export default Allnotes;
