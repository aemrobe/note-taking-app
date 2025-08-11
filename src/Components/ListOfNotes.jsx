import { NavLink, useLocation } from "react-router";
import { useTag } from "../Context/TagContext";
import { formatDate } from "../config/constants";
import EmptyNotes from "./EmptyNotes";
import { useSettings } from "../Context/SettingsContext";

function ListOfNotes({ type, notes }) {
  const { uiMode } = useTag();
  const { activeColorTheme } = useSettings();

  return (
    <div
      className={`${
        activeColorTheme === "dark" &&
        type === "Archived Notes" &&
        "isArchivedOnly"
      }`}
    >
      {uiMode !== "filteredNotes" && type !== "search" && (
        <h1 className="text-2xl pt-5 pb-4  font-bold text-text-primary">
          {type}
        </h1>
      )}

      <div className="text-sm -tracking-50 leading-50">
        {type === "Archived Notes" && (
          <p className="text-page-description-text mb-4">
            All your archive notes are stored here. You can restore or delete
            them anytime.
          </p>
        )}
        {notes.length === 0 &&
        (type === "Archived Notes" || type === "All Notes") ? (
          <EmptyNotes link={type === "Archived Notes" && "create a new note."}>
            {type === "All Notes" ? (
              <>
                You don’t have any notes yet. Start a new note to capture your
                thoughts and ideas.
              </>
            ) : (
              <>
                No notes have been archived yet. Move notes here for
                safekeeping, or{" "}
              </>
            )}
          </EmptyNotes>
        ) : (
          ""
        )}
      </div>

      <ul className="divide-y divide-border-separator">
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
    <li>
      <NavLink
        to={`${note.title}`}
        state={{ from: location.pathname }}
        className="focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2 w-full  px-2 pt-2 pb-3 flex flex-col space-y-3 items-start"
      >
        <h2 className="font-semibold text-text-primary">{note.title}</h2>
        <ListOfTags tags={note.tags} />
        <p className="text-xs text-text-secondary">
          {formatDate(note.lastEdited)}
        </p>
      </NavLink>
    </li>
  );
}

function ListOfTags({ tags }) {
  return (
    <span className="space-x-1">
      <span className="sr-only">Tags:</span>

      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="bg-background-tag rounded py-0.5 px-1.5 font-normal text-text-primary text-xs">
      {children}
    </span>
  );
}

export default ListOfNotes;
