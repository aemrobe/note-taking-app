import { NavLink } from "react-router";
import PlusIcon from "./PlusIcon";

import { useNotes } from "../Context/NoteContext";

function CreateNewNote({ parentPath }) {
  const { isSmallerScreenSize, setLastFocusableElement } = useNotes();

  const fromState = {
    from: parentPath,
  };

  const path = parentPath.includes("/archived-notes")
    ? "/archived-notes/new"
    : "/all-notes/new";

  return (
    <div>
      <NavLink
        to={path}
        onClick={() => {
          setLastFocusableElement(document.activeElement);
        }}
        state={fromState}
        search=""
        aria-label="create new note"
        className="z-40 focusable-ring  bg-button-create-note-background text-button-create-note-icon rounded-full fixed right-4 md:right-[2.1875rem] bottom-[4.5rem] md:bottom-[6.625rem] p-2 md:p-4 xl:flex xl:items-center xl:static xl:justify-center xl:py-3 xl:rounded-lg xl:mb-4 xl:text-sm "
      >
        <PlusIcon width={isSmallerScreenSize ? "w-8" : "w-4"} />
        {!isSmallerScreenSize && "Create New Note"}
      </NavLink>
    </div>
  );
}

export default CreateNewNote;
