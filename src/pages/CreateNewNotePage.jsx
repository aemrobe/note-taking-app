import { useNavigate } from "react-router";
import NoteActions from "../Components/NoteActions";
import LabeledIconText from "../Components/LabeledIconText";
import TagIcon from "../Components/TagIcon";
import { useEffect, useState } from "react";
import LastEditedIcon from "../Components/LastEditedIcon";
import TextareaAutosize from "react-textarea-autosize";
import { useSettings } from "../Context/SettingsContext";
import useDraftNotes from "../Hooks/useDraftNotes";
import { APP_NAME, formatDate } from "../config/constants";
import { useNotes } from "../Context/NoteContext";
import {
  validateRequired,
  validateUniqueTitle,
  validateField,
} from "../utils/validators";
import Error from "../Components/Error";
import { useToast } from "../Context/ToastContext";

function CreateNewNotePage() {
  const { handleShowToastMessage } = useToast();
  const navigate = useNavigate();
  const { notes, setNotes } = useNotes();
  // Errors
  const [errorNoteTitle, setErrorNoteTitle] = useState(null);
  const { activeColorTheme } = useSettings();
  //Fields

  const {
    getDraftNoteContent,
    draftNotesContent,
    setDraftContent,
    clearDraftContent,
  } = useDraftNotes("CreateNewNoteDraft");

  useEffect(() => {
    document.title = `Create New Note - ${APP_NAME}`;
  }, []);

  useEffect(
    function () {
      localStorage.setItem(
        "CreateNewNoteDraft",
        JSON.stringify(draftNotesContent)
      );
    },
    [draftNotesContent]
  );

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

    navigate(-1);
  };

  const handleCancelButton = function (e) {
    e.preventDefault();
    navigate(-1);
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
        isArchived: false,
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);

      handleShowToastMessage({ text: "Note created successfully!" });

      clearDraftContent("newNote");

      navigate(-1);
    }
  };

  return (
    <form className="flex flex-col">
      <div className="mb-1">
        <NoteActions
          onGoBack={handleGoBackBtn}
          onCancel={handleCancelButton}
          onSave={handleSaveNotes}
        />
      </div>
      <div className={`${errorNoteTitle && "pb-2"}`}>
        <TextareaAutosize
          name="new note title"
          aria-invalid={!!errorNoteTitle || undefined}
          aria-describedby={
            errorNoteTitle ? "create-note-title-error" : undefined
          }
          value={title}
          minRows={
            (errorNoteTitle && !title) ||
            (!errorNoteTitle && !title) ||
            (!errorNoteTitle && title)
              ? 2
              : 1
          }
          maxRows={4}
          className={`${
            activeColorTheme === "light"
              ? "mt-2"
              : activeColorTheme === "dark" && !errorNoteTitle
              ? "my-2"
              : "mt-2"
          } text-new-input-text-color 
        w-full
        resize-none overflow-y-auto placeholder:font-bold placeholder:text-new-note-title-placeholder-text
        placeholder:-tracking-100 
        focus:outline-none placeholder:text-input-new-note-title-placeholder-color`}
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
      <div className="flex flex-col flex-auto text-new-note-text-fontSize leading-new-note-text-lineHeight">
        <div className="flex">
          <div className="w-full grid grid-cols-[auto_1fr] items-center pb-3 gap-y-1 gap-x-2  border-b border-border-separator">
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
          placeholder:text-new-note-input-placeholder-color -tracking-50 "
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
          className="flex-auto overflow-y-auto  my-3 resize-none focus:outline-none w-full  placeholder:text-new-note-content-placholder-color  -tracking-50  text-new-input-text-color"
          placeholder="Start typing your note here..."
        ></textarea>
      </div>
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
