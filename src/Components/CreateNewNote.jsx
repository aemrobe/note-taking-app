import { NavLink } from "react-router";
import PlusIcon from "./PlusIcon";
import React, { useEffect } from "react";

const CreateNewNote = React.forwardRef(function CreateNewNote(props, ref) {
  useEffect(() => {
    console.log("CreateNewNote ref attached to:", ref?.current);
  }, [ref]);

  return (
    <div>
      <NavLink
        ref={ref}
        to={"create-new-note"}
        className="z-40 focus-visible:outline-none focus:ring-2 ring-focus-ring ring-offset-2 bg-button-create-note-background text-button-create-note-icon rounded-full fixed right-4 bottom-[4.5rem] p-2"
      >
        <PlusIcon width={"w-8"} />
      </NavLink>
    </div>
  );
});

export default CreateNewNote;
