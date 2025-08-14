import { useLocation, useNavigate, useParams } from "react-router";
import TagIcon from "../Components/TagIcon";
import { useNotes } from "../Context/NoteContext";
import { useEffect, useRef, useState } from "react";
import {
  APP_NAME,
  formatDate,
  localStorageDetailsOfNotesDraft,
} from "../config/constants";
import StatusIcon from "../Components/StatusIcon";
import LastEditedIcon from "../Components/LastEditedIcon";
import { useToast } from "../Context/ToastContext";
import NoteActions from "../Components/NoteActions";
import LabeledIconText from "../Components/LabeledIconText";
import TextareaAutosize from "react-textarea-autosize";
import Error from "../Components/Error";
import useDraftNotes from "../Hooks/useDraftNotes";
import {
  validateRequired,
  validateUniqueTitle,
  validateField,
} from "../utils/validators";
import Spinner from "../Components/Spinner";
import SpinnerFullPage from "../Components/SpinnerFullPage";

function DetailOfNotes() {
  const { noteTitle } = useParams();
  const { handleShowToastMessage } = useToast();
  const { notes, setNotes } = useNotes();
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const mainInfoTitleRef = useRef();

  const {
    getDraftNoteContent,
    draftNotesContent,
    setDraftContent,
    clearDraftContent,
  } = useDraftNotes(localStorageDetailsOfNotesDraft);

  useEffect(
    function () {
      localStorage.setItem(
        localStorageDetailsOfNotesDraft,
        JSON.stringify(draftNotesContent)
      );
    },
    [draftNotesContent]
  );

  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.from || "/all-notes";

  const selectedNote = notes?.find((note) => note.title === noteTitle);
  const initialNoteTitleFromParamsRef = useRef(noteTitle);
  const pendingNavigationPathRef = useRef(null);

  console.log("selectedNote", selectedNote);

  const draft = getDraftNoteContent(noteTitle);
  // ### States ###
  // Input Values
  const [selectedNoteTitle, setSelectedNoteTitle] = useState(function () {
    return draft !== undefined ? draft.newTitle : selectedNote?.title || "";
  });
  const [tags, setTags] = useState(function () {
    return draft !== undefined
      ? draft.tags
      : selectedNote?.tags.join(", ") || "";
  });
  const [textContent, setTextContent] = useState(function () {
    return draft !== undefined ? draft.content : selectedNote?.content || "";
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(
    function () {
      if (!selectedNote) return;

      const { title, tags: tagsSelected, content } = selectedNote;
      const hasTitleChanged = selectedNoteTitle !== title;
      const hasTagsChanged = tags !== tagsSelected.join(", ");
      const hasTextChanged = textContent !== content;

      setHasChanges(hasTitleChanged || hasTagsChanged || hasTextChanged);
    },
    [selectedNote, selectedNoteTitle, tags, textContent]
  );

  // Errors
  const [errorNoteTitle, setErrorNoteTitle] = useState(null);

  //a condition that check if the save button should be disabled or not
  const isSaveDisabled = !!errorNoteTitle || !hasChanges;

  console.log("isSaveDisabled", isSaveDisabled);

  useEffect(() => {
    initialNoteTitleFromParamsRef.current = noteTitle;
  }, [noteTitle]);

  useEffect(() => {
    mainInfoTitleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (
      pendingNavigationPathRef.current &&
      decodeURIComponent(noteTitle) ===
        decodeURIComponent(pendingNavigationPathRef.current)
    ) {
      pendingNavigationPathRef.current = null;
      //showing the spinner
      setShowPlaceholder(false);
    }
  }, [noteTitle]);

  useEffect(() => {
    if (selectedNote) {
      const draft = getDraftNoteContent(noteTitle);

      setSelectedNoteTitle(
        draft !== undefined ? draft.newTitle : selectedNote.title || ""
      );
      setTags(
        draft !== undefined ? draft.tags : selectedNote.tags.join(", ") || ""
      );
      setTextContent(
        draft !== undefined ? draft.content : selectedNote.content || ""
      );
    } else {
      setSelectedNoteTitle("");
      setTags("");
      setTextContent("");
    }
  }, [selectedNote, getDraftNoteContent, noteTitle]);

  //Fields
  const fields = [
    {
      value: selectedNoteTitle,
      validators: [
        validateRequired,
        (value) =>
          validateUniqueTitle(
            value,
            notes,
            decodeURIComponent(initialNoteTitleFromParamsRef.current)
          ),
      ],
      setError: setErrorNoteTitle,
    },
  ];

  const handleTitleChange = function (e) {
    const newInputValue = e.target.value;
    setSelectedNoteTitle(newInputValue);

    const { validators, setError } = fields[0];

    const error = validateField(validators, newInputValue);
    setError(error);
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

    const originalNoteTitleInContext = initialNoteTitleFromParamsRef.current;
    const noteToUpdate = notes?.find(
      (note) => note.title === originalNoteTitleInContext
    );

    //showing the spinner
    setShowPlaceholder(true);

    const newNoteTitle = selectedNoteTitle.trim();
    const newTagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    // When there is no Form Error
    if (formError.length === 0) {
      if (
        textContent === noteToUpdate.content &&
        newTagsArray.join(", ") === noteToUpdate.tags.join(", ") &&
        newNoteTitle === noteToUpdate.title
      ) {
        return;
      }

      const currentPathSegments = location.pathname.split("/");
      const basePath = `${currentPathSegments[1]}`;
      const newFullPathToNavigate = `/${basePath}/${encodeURIComponent(
        newNoteTitle
      )}`;

      pendingNavigationPathRef.current = newFullPathToNavigate;

      setNotes((prevNotes) => {
        const noteIndex = prevNotes.findIndex(
          (note) => note.title === originalNoteTitleInContext
        );
        const updatedNotes = [...prevNotes];

        const newTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== " ");

        updatedNotes[noteIndex] = {
          ...updatedNotes[noteIndex],
          content: textContent,
          tags: newTags,
          title: newNoteTitle,
          lastEdited: new Date().toISOString(),
        };

        return updatedNotes;
      });

      clearDraftContent(originalNoteTitleInContext);
      handleShowToastMessage({ text: "Note saved successfully!" }, () => {
        navigate(newFullPathToNavigate, { replace: true });
        setShowPlaceholder(false);
      });
    }
  };

  console.log("showplaceholder", showPlaceholder);

  const handleArchiveNotes = function () {
    pendingNavigationPathRef.current = prevPath;

    //showing the spinner
    setShowPlaceholder(true);

    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex(
        (note) => note.title === selectedNote.title
      );

      const updatedNotes = [...prevNotes];

      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        isArchived: true,
      };

      return updatedNotes;
    });

    handleShowToastMessage(
      {
        text: "Note archived.",
        link: "Archived Notes",
        ariaLabelText: "Go to Archived Notes",
      },
      () => navigate(prevPath, { replace: true })
    );
  };

  const handlelRestoreArchivedNotes = function () {
    pendingNavigationPathRef.current = prevPath;

    //showing the spinner
    setShowPlaceholder(true);

    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex(
        (note) => note.title === selectedNote.title
      );

      const updatedNotes = [...prevNotes];

      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        isArchived: false,
      };

      return updatedNotes;
    });

    handleShowToastMessage(
      {
        text: "Note restored to active notes.",
        link: "All Notes",
        ariaLabelText: "Go to All Notes",
      },
      () => navigate(prevPath, { replace: true })
    );
  };

  const handleDeleteNote = function () {
    pendingNavigationPathRef.current = prevPath;

    //showing the spinner
    setShowPlaceholder(true);

    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.title !== selectedNote.title)
    );

    handleShowToastMessage(
      {
        text: "Note permanently deleted.",
      },
      () => navigate(prevPath, { replace: true })
    );

    clearDraftContent(initialNoteTitleFromParamsRef.current);
  };

  const handleCancelButton = function (e) {
    e.preventDefault();
    navigate(-1);
  };

  const handleGoBackBtn = function (e) {
    e.preventDefault();

    if (
      textContent !== selectedNote.content ||
      tags !== selectedNote.tags.join(", ") ||
      selectedNoteTitle !== selectedNote.title
    ) {
      setDraftContent(noteTitle, selectedNoteTitle, tags, textContent);
    } else {
      clearDraftContent(noteTitle);
    }

    navigate(-1);
  };

  useEffect(
    function () {
      if (
        !pendingNavigationPathRef.current &&
        notes !== null &&
        notes !== undefined
      )
        if (!selectedNote) {
          navigate(prevPath, { replace: true });
        }
    },
    [navigate, prevPath, selectedNote, notes]
  );

  if (showPlaceholder) {
    return <SpinnerFullPage />;
  }

  console.log("pending", pendingNavigationPathRef.current);

  if (!selectedNote && !pendingNavigationPathRef.current) <p>note not found</p>;

  return (
    <form action={"#"} className="flex-auto flex flex-col">
      {/* Mobile Header Controller */}
      <NoteActions
        onGoBack={handleGoBackBtn}
        onDeleteNote={handleDeleteNote}
        isArchived={selectedNote?.isArchived}
        onRestoreNote={handlelRestoreArchivedNotes}
        onArchiveNote={handleArchiveNotes}
        onCancel={handleCancelButton}
        onSave={handleSaveNotes}
        fontSize={"text-sm"}
        isSaveDisabled={isSaveDisabled}
        isError={errorNoteTitle}
      />

      <div className="flex flex-col flex-auto">
        {/* Note title information */}
        <div className={"text-xs border-b border-border-separator"}>
          <div className={`pt-3 ${errorNoteTitle && "pb-3"}`}>
            <h1 id="note-title-heading" className="sr-only">
              Edit Note
            </h1>

            <TextareaAutosize
              aria-labelledby="note-title-heading"
              aria-invalid={!!errorNoteTitle || undefined}
              aria-describedby={
                errorNoteTitle ? "details-note-title-error" : undefined
              }
              ref={mainInfoTitleRef}
              name="noteTitle"
              className={`${!errorNoteTitle && "pb-3"} text-2xl w-full
           placeholder:text-input-new-note-title-placeholder-color resize-none
            text-text-primary font-bold  -tracking-150 focus:outline-none`}
              minRows={1}
              maxRows={4}
              placeholder="Enter a title..."
              value={selectedNoteTitle}
              onChange={handleTitleChange}
              id=""
            />
            {errorNoteTitle && (
              <Error error={errorNoteTitle} id="details-note-title-error" />
            )}
          </div>

          <div className="flex ">
            <div className="text-neutral700 w-full grid grid-cols-[auto_1fr] items-center gap-x-7 gap-y-2 pb-3 ">
              <label
                htmlFor="tagValue"
                className="self-start flex items-center space-x-1.5 text-text-label"
              >
                <TagIcon width={"w-4"} />
                <span>Tags</span>
              </label>

              <TextareaAutosize
                name="tagValue"
                id="tagValue"
                className="w-full 
                placeholder:text-new-note-input-placeholder-color
                focus:outline-none resize-none overflow-y-auto max-h-20 text-text-value"
                placeholder="Add tags separated by commas (e.g. Work, Planning)"
                value={tags}
                minRows={1}
                maxRows={4}
                onChange={(e) => setTags(e.target.value)}
              />

              {selectedNote?.isArchived && (
                <DetailInfoElements
                  labelIconValue={
                    <>
                      <StatusIcon width={"w-4"} />
                      <span>Status</span>
                    </>
                  }
                  content={"Archived"}
                />
              )}
              <DetailInfoElements
                labelType="last"
                labelIconValue={
                  <>
                    <LastEditedIcon width={"w-4"} />
                    <span> Last edited</span>
                  </>
                }
                content={
                  draft !== undefined
                    ? formatDate(draft.lastEdited)
                    : formatDate(selectedNote?.lastEdited)
                }
              />
            </div>
          </div>
        </div>

        {/* Note Text Content */}
        <textarea
          value={textContent}
          aria-label="Note Content"
          onChange={(e) => setTextContent(e.target.value)}
          name="Note text"
          placeholder="Start typing your note here…"
          className="flex-auto overflow-y-auto resize-none w-full mt-3 text-sm leading-50 -tracking-50 focus:outline-none text-note-content-text"
        ></textarea>

        {/* Desktop Save Note and Cancel Button */}
        <div className="hidden">
          <button>Save Note</button>
          <button>Cancel</button>
        </div>
      </div>
      {/* Desktop Archive and Delete buttons*/}
      <div className="hidden">
        <button>
          <img src="/images/icon-archive.svg" alt="" />
          <span>Archive Note</span>
        </button>

        <button>
          <img src="/images/icon-delete.svg" alt="" />
          <span>Delete Note</span>
        </button>
      </div>
    </form>
  );
}

function DetailInfoElements({ labelIconValue, labelType = "", content }) {
  return (
    <>
      <LabeledIconText>{labelIconValue}</LabeledIconText>
      <span
        className={`${
          labelType === "last" ? "text-text-value-last" : "text-text-value"
        }`}
      >
        {content}
      </span>
    </>
  );
}
export default DetailOfNotes;
