import { useFocus } from "../Context/FocusContext";
import CreateNewNote from "./CreateNewNote";

function CreateNewNoteWithContext() {
  const { createNewNoteButtonRef } = useFocus();

  return <CreateNewNote ref={createNewNoteButtonRef} />;
}

export default CreateNewNoteWithContext;
