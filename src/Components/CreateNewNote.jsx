import { NavLink } from "react-router";
import PlusIcon from "./PlusIcon";

function CreateNewNote() {
  return (
    <NavLink
      to={"create-new-note"}
      aria-label="Create a new note"
      className="z-40 focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2 bg-button-create-note-background text-button-create-note-icon rounded-full fixed right-4 bottom-[4.5rem] p-2"
    >
      <PlusIcon width={"w-8"} />
    </NavLink>
  );
}

export default CreateNewNote;
