import { useLocation, useNavigate } from "react-router";
import NoteActions from "../Components/NoteActions";
import LabeledIconText from "../Components/LabeledIconText";
import TagIcon from "../Components/TagIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import LastEditedIcon from "../Components/LastEditedIcon";
import TextareaAutosize from "react-textarea-autosize";
import { APP_NAME } from "../config/constants";

import useDraftNotes from "../Hooks/useDraftNotes";
import { formatDate } from "../config/constants";
import { useNotes } from "../Context/NoteContext";
import {
  validateRequired,
  validateUniqueTitle,
  validateField,
} from "../utils/validators";
import Error from "../Components/Error";
import { useToast } from "../Context/ToastContext";

function CreateNewNotePage() {
  const location = useLocation();
  const locationPathSegments = location.pathname.split("/");
  const defaultFallbackPath = `/${locationPathSegments[1]}`;
  const [previousPath] = useState(function () {
    return location.state?.from || defaultFallbackPath;
  });

  const noteType = previousPath.includes("/archived-notes") ? true : false;

  const { onShowToastMessage } = useToast();
  const navigate = useNavigate();
  const { notes, setNotes, isSmallerScreenSize } = useNotes();
  const pageTitle = useRef(null);

  useEffect(function () {
    pageTitle.current.focus();
  }, []);

  // Errors
  const [errorNoteTitle, setErrorNoteTitle] = useState(null);

  //a condition that check if the save button should be disabled or not
  const isSaveDisabled = !!errorNoteTitle;

  //Fields
  const {
    getDraftNoteContent,
    draftNotesContent,
    setDraftContent,
    clearDraftContent,
  } = useDraftNotes("CreateNewNoteDraft");

  useEffect(
    function () {
      localStorage.setItem(
        "CreateNewNoteDraft",
        JSON.stringify(draftNotesContent)
      );
    },
    [draftNotesContent]
  );

  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  useEffect(() => {
    if (!isSmallerScreenSize) return;
    const previousTitle = document.title;
    document.title = `${
      pathMatch("/all-notes/new") || pathMatch("/archived-notes/new")
        ? "Create New Note"
        : `${previousTitle}`
    } - ${APP_NAME}
       `;
  }, [location.state, pathMatch, isSmallerScreenSize]);

  const draft = getDraftNoteContent("newNote");

  const [title, setTitle] = useState(function () {
    return draft !== undefined ? draft.newTitle : "";
  });
  const [tag, setTag] = useState(function () {
    return draft !== undefined ? draft.tags : "";
  });
  const [noteContent, setNoteContent] = useState(function () {
    return draft !== undefined ? draft.content : "";
  });

  const fields = [
    {
      value: title,
      validators: [
        validateRequired,
        (value) => validateUniqueTitle(value, notes),
      ],
      setError: setErrorNoteTitle,
    },
  ];

  const handleTitleChange = function (e) {
    const newInputValue = e.target.value;
    setTitle(newInputValue);

    const { validators, setError } = fields[0];

    const error = validateField(validators, newInputValue);
    setError(error);
  };

  const handleGoBackBtn = function (e) {
    e.preventDefault();

    const isCurrentInputEmpty =
      title.trim() === "" && tag.trim() === "" && noteContent.trim() === "";

    if (isCurrentInputEmpty) {
      clearDraftContent("newNote");
    } else {
      setDraftContent("newNote", title, tag, noteContent);
    }

    navigate(previousPath, { state: { fromCreateNote: true } });
  };

  const handleCancelButton = function (e) {
    e.preventDefault();
    navigate(previousPath, { state: { fromCreateNote: true } });
    clearDraftContent("newNote");
  };

  const handleSaveNotes = function (e) {
    e.preventDefault();

    const formError = [];

    for (const field of fields) {
      const error = validateField(field.validators, field.value);

      if (error) {
        field.setError(error);
        formError.push(error);
      } else {
        field.setError(null);
      }
    }

    if (formError.length === 0) {
      const newNote = {
        title: title,
        tags: tag
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== " "),
        content: noteContent,
        lastEdited: new Date().toISOString(),
        isArchived: noteType,
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);

      onShowToastMessage({ text: "Note created successfully!" });

      clearDraftContent("newNote");

      const newPath =
        previousPath.includes("/all-notes") ||
        previousPath.includes("/archived-notes")
          ? previousPath
          : "/all-notes";

      navigate(`${newPath}/${encodeURIComponent(title)}`, {
        state: { fromCreateNote: true },
      });
    }
  };

  return (
    <form
      className="flex flex-col 2xl:pt-5 2xl:px-6 2xl:pb-5 md:w-full
     md:max-w-[45rem] md:mx-auto 2xl:mx-0 2xl:max-w-none"
    >
      <h1 ref={pageTitle} className="sr-only" tabIndex={-1}>
        Create New Note
      </h1>

      {isSmallerScreenSize && (
        <div className="mb-1">
          <NoteActions
            onGoBack={handleGoBackBtn}
            isSaveDisabled={isSaveDisabled}
            isError={errorNoteTitle}
            onCancel={handleCancelButton}
            onSave={handleSaveNotes}
          />
        </div>
      )}

      <div className={`${errorNoteTitle && "pb-2"}`}>
        <TextareaAutosize
          name="new note title"
          aria-invalid={!!errorNoteTitle || undefined}
          aria-describedby={
            errorNoteTitle ? "create-note-title-error" : undefined
          }
          value={title}
          minRows={1}
          maxRows={4}
          className={`${
            !errorNoteTitle ? "mt-2 mb-3 2xl:mt-0" : "mt-2 2xl:mt-0"
          } text-new-input-text-color 
        w-full
        resize-none overflow-y-auto placeholder:font-bold placeholder:text-new-note-title-placeholder-text
        placeholder:-tracking-100 
        focus:outline-none placeholder:text-input-new-note-title-placeholder-color font-bold text-new-note-title-placeholder-text`}
          onChange={handleTitleChange}
          placeholder="Enter a title..."
        />

        {errorNoteTitle && (
          <Error
            marginTop={`${errorNoteTitle && !title ? "" : "mt-1"}`}
            error={errorNoteTitle}
            id={"create-note-title-error"}
          />
        )}
      </div>
      <div className="flex flex-col flex-auto text-new-note-text-fontSize md:text-sm leading-new-note-text-lineHeight">
        <div className="flex">
          <div className="w-full grid grid-cols-[auto_1fr] items-center pb-3 gap-y-1 md:gap-y-2 gap-x-2  border-b border-border-separator">
            <LabelElementWithText forValue={"input-tag"}>
              <TagIcon width={"w-4"} />
              <span>Tags</span>
            </LabelElementWithText>

            <TextareaAutosize
              name="tags"
              value={tag}
              minRows={1}
              maxRows={4}
              onChange={(e) => setTag(e.target.value)}
              id="input-tag"
              className="overflow-y-auto max-h-20 focus:outline-none  resize-none  text-new-input-text-color
          placeholder:text-new-note-input-placeholder-color -tracking-50 text-sm leading-50 2xl:focus:border-2 2xl:py-1 2xl:focus:border-neutral500  rounded-lg"
              placeholder="Add tags separated by commas (e.g. Work, Planning)"
            />

            <LabeledIconText padding={"py-1 pr-8"}>
              <LastEditedIcon width={"w-4"} />
              <span> Last edited</span>
            </LabeledIconText>

            <span className="text-new-note-last-edited-text-color -tracking-50">
              {draft !== undefined
                ? formatDate(draft.lastEdited)
                : "Not yet saved"}
            </span>
          </div>
        </div>

        <textarea
          name="note-content"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="flex-auto overflow-y-auto  my-3 resize-none focus:outline-none w-full  placeholder:text-new-note-content-placholder-color  -tracking-50  text-new-input-text-color text-sm leading-50"
          placeholder="Start typing your note here..."
        ></textarea>
      </div>

      {!isSmallerScreenSize && (
        <NoteActions
          onCancel={handleCancelButton}
          onSave={handleSaveNotes}
          isSaveDisabled={isSaveDisabled}
          isError={errorNoteTitle}
        />
      )}
    </form>
  );
}

function LabelElementWithText({ children, forValue }) {
  return (
    <label
      htmlFor={forValue}
      className="self-start flex items-center space-x-1.5 py-1 text-text-label "
    >
      {children}
    </label>
  );
}

export default CreateNewNotePage;
