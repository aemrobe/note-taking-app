import { NavLink, useLocation, useParams, useSearchParams } from "react-router";
import { TOAST_DURATION_MS } from "../config/constants";
import EmptyNotes from "./ui/EmptyNotes";
import { useSettings } from "../Context/SettingsContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNotes } from "../Context/NoteContext";
import { useToast } from "../Context/ToastContext";
import FilterStatusMessage from "./ui/FilterStatusMessage";
import { useTag } from "../Context/TagContext";
import CreateNewNote from "./CreateNewNote";
import { formatDate } from "../utils/validators";

function ListOfNotes({ type, notes, parentPath, uiMode = "tagSelection" }) {
  const location = useLocation();
  const { isSmallerScreenSize } = useNotes();
  const { activeColorTheme } = useSettings();
  const { showToastMessage } = useToast();
  const { tagLists } = useTag();
  const { notes: allnotes } = useNotes();

  const [showEmptyNotes, setShowEmptyNotes] = useState(false);
  const [accessibleMessage, setAccessibleMessage] = useState(null);

  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  const emptyNotes = useCallback(
    (forAriaLive = false) => {
      if (allnotes.length === 0) {
        return forAriaLive ? (
          "You don’t have any notes yet. Start a new note to capture your thoughts and ideas."
        ) : (
          <>
            You don’t have any notes yet. Start a new note to capture your
            thoughts and ideas.
          </>
        );
      } else if (notes.length === 0) {
        if (type === "All Notes") {
          return forAriaLive ? (
            "All your active notes have been moved to the archive. You can restore them anytime."
          ) : (
            <>
              All your active notes have been moved to the archive. You can
              restore them anytime.
            </>
          );
        } else if (type === "Archived Notes") {
          return forAriaLive ? (
            "No notes have been archived yet. Move notes here for safekeeping, or create new note"
          ) : (
            <>
              No notes have been archived yet. Move notes here for safekeeping,
              or{" "}
            </>
          );
        } else if (type === "search") {
          return forAriaLive ? (
            "No notes match your search. Try a different keyword or create new note"
          ) : (
            <>No notes match your search. Try a different keyword or </>
          );
        } else if (type === "tags") {
          const isSingular = allnotes.length <= 1 || notes.length;

          const tagWord = isSingular ? "tag" : "tags";
          const pronoun = isSingular ? "this" : "these";

          return forAriaLive ? (
            `No notes found with ${pronoun} ${tagWord}. Try selecting a different one.`
          ) : (
            <>
              No notes found with {pronoun} {tagWord}. Try selecting a different
              one.
            </>
          );
        }

        return null;
      }

      return null;
    },
    [allnotes.length, notes.length, type]
  );

  const searchPage = pathMatch("/search");
  const createNewNotePage =
    pathMatch("/all-notes/new") || pathMatch("/archived-notes/new");
  const displayBorderSeparator =
    pathMatch("/all-notes") || pathMatch("/archived-notes");
  const dontDisplayCreateNewNoteBtn =
    pathMatch("/all-notes/") ||
    pathMatch("/search/") ||
    pathMatch("/archived-notes/") ||
    pathMatch("/tags/") ||
    pathMatch("/settings");

  const linkInsideEmptyNotes =
    (type === "search" || type === "Archived Notes") &&
    allnotes.length !== 0 &&
    "create a new note.";

  const pageTitle = useRef(null);

  useEffect(
    function () {
      if (showToastMessage) {
        return;
      }

      if (pageTitle.current) {
        pageTitle.current?.focus();
      }
    },
    [showToastMessage]
  );

  useEffect(
    function () {
      if (allnotes.length === 0 || notes.length === 0) {
        setShowEmptyNotes(true);
        const delay = showToastMessage ? TOAST_DURATION_MS + 200 : 1000;

        const timer = setTimeout(() => {
          setAccessibleMessage(emptyNotes(true));
        }, delay);

        return () => {
          clearTimeout(timer);
          setShowEmptyNotes(false);
          setAccessibleMessage(null);
        };
      } else {
        setShowEmptyNotes(false);
      }
    },
    [
      allnotes.length,
      notes.length,
      emptyNotes,
      location.state,
      showToastMessage,
    ]
  );
  return (
    <div
      className={`md:w-full md:max-w-[43.75rem] xl:max-w-none md:mx-auto xl:mx-0 xl:pt-5 xl:pr-4 xl:pl-8  xl:w-[18.125rem] ${
        displayBorderSeparator ? "xl:border-r xl:border-border-separator" : ""
      } ${
        activeColorTheme === "dark" && type === "Archived Notes"
          ? "isArchivedOnly"
          : ""
      }`}
    >
      {!isSmallerScreenSize && type === "tags" && (
        <FilterStatusMessage
          filterTexts={`"${tagLists}"`}
          lastText={"tag are shown here."}
          marginBottom="mb-4"
        >
          All notes with{" "}
        </FilterStatusMessage>
      )}

      {!isSmallerScreenSize ? <CreateNewNote parentPath={parentPath} /> : ""}

      {isSmallerScreenSize &&
        uiMode !== "filteredNotes" &&
        type !== "search" && (
          <h1
            tabIndex={-1}
            ref={pageTitle}
            className="text-2xl pt-5 md:pt-6 pb-4  font-bold text-text-primary focus:outline-none"
          >
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
        {emptyNotes() && !createNewNotePage ? (
          <EmptyNotes link={linkInsideEmptyNotes}>{emptyNotes()}</EmptyNotes>
        ) : (
          ""
        )}
      </div>

      {showEmptyNotes && !searchPage && (
        <div aria-live="polite" role="status" className="sr-only">
          {accessibleMessage}
        </div>
      )}

      {!isSmallerScreenSize && createNewNotePage && (
        <div className="9 p-2 bg-desktop-navigation-link-background-active rounded-md mb-1 text-base -tracking-100 font-semibold text-text-secondary">
          Untitled Note
        </div>
      )}

      <ul className="divide-y divide-border-separator">
        {notes.map((note) => (
          <Note note={note} key={note.title} parentPath={parentPath} />
        ))}
      </ul>

      {isSmallerScreenSize && !dontDisplayCreateNewNoteBtn ? (
        <CreateNewNote parentPath={parentPath} />
      ) : (
        ""
      )}
    </div>
  );
}

function Note({ note, parentPath }) {
  const location = useLocation();
  const { noteTitle } = useParams();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.toString();

  const isNoteActive = note.title === noteTitle;
  const searchAndTagspage =
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/tags");

  const navigateToNote = {
    pathname: `${encodeURIComponent(note.title)}`,
  };

  const fromState = {
    from: parentPath,
  };

  if (searchAndTagspage && currentQuery) {
    navigateToNote.search = location.search;

    fromState.from = parentPath + location.search;
  }

  return (
    <li
      className={`${
        isNoteActive ? "xl:bg-desktop-note-active xl:rounded-md" : ""
      } w-full  px-2 pt-2 pb-3 flex flex-col flex-wrap space-y-3 items-start relative`}
    >
      <NavLink
        to={navigateToNote}
        state={fromState}
        className={"stretched-link focusable-ring w-full"}
      >
        <h2 className="font-semibold text-text-primary break-words">
          {note.title}
        </h2>
      </NavLink>

      <ListOfTags tags={note.tags} />
      <p className="text-xs text-text-secondary">
        {formatDate(note.lastEdited)}
      </p>
    </li>
  );
}

function ListOfTags({ tags }) {
  return (
    <ul className="flex flex-wrap gap-1">
      <li className="sr-only">:</li>

      {tags.length !== 0 ? (
        tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)
      ) : (
        <Tag> No Tags</Tag>
      )}
    </ul>
  );
}

function Tag({ children }) {
  return (
    <li className="bg-background-tag rounded py-0.5 px-1.5 font-normal text-text-primary text-xs">
      {children}
    </li>
  );
}

export default ListOfNotes;
