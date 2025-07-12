import { NavLink, useLocation } from "react-router";
import { useTag } from "../Context/TagContext";
import { formatDate } from "../config/constants";
import EmptyNotes from "./EmptyNotes";

function ListOfNotes({ type, notes }) {
  const { uiMode } = useTag();

  return (
    <div>
      {uiMode !== "filteredNotes" && type !== "search" && (
        <h1 className="text-2xl pt-5 pb-4  font-bold">{type}</h1>
      )}

      {notes.length === 0 &&
      (type === "Archived Notes" || type === "All Notes") ? (
        <EmptyNotes
          element={
            type === "Archived Notes" && (
              <p className="text-neutral700 mb-4">
                All your archive notes are stored here. You can restore or
                delete then anytime.
              </p>
            )
          }
        >
          {type === "All Notes" ? (
            <>
              You don’t have any notes yet. Start a new note to capture your
              thoughts and ideas.
            </>
          ) : (
            <>
              No notes have been archived yet. Move notes here for safekeeping,
              or{" "}
              <span className="underline underline-offset-2 decoration-1 decoration-neutral950">
                create a new note.
              </span>
            </>
          )}
        </EmptyNotes>
      ) : (
        ""
      )}

      <ul className="">
        {notes.map((note) => (
          <Note note={note} key={note.title} />
        ))}
      </ul>
    </div>
  );
}

function Note({ note }) {
  const location = useLocation();

  return (
    <li className="border-b border-neutral200">
      <NavLink
        to={`${note.title}`}
        state={{ from: location.pathname }}
        className="w-full  px-2 pt-2 pb-3 flex flex-col space-y-3 items-start "
      >
        <h2 className="font-semibold text-neutral950">{note.title}</h2>
        <ListOfTags tags={note.tags} />
        <p className="text-xs text-neutral700">{formatDate(note.lastEdited)}</p>
      </NavLink>
    </li>
  );
}

function ListOfTags({ tags }) {
  return (
    <span className="space-x-1">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="bg-neutral200 rounded py-0.5 px-1.5 font-normal text-neutral950">
      {children}
    </span>
  );
}

export default ListOfNotes;
