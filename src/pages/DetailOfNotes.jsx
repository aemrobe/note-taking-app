import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import TagIcon from "../Components/TagIcon";
import { useNotes } from "../Context/NoteContext";
import { useEffect, useRef, useState } from "react";
import {
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
import ArchiveIcon from "../Components/ArchiveIcon";
import DeleteIcon from "../Components/DeleteIcon";
import RestoreIcon from "../Components/RestoreIcon";
import { useModal } from "../Context/ModalContext";
import SpinnerFullPage from "../Components/SpinnerFullPage";

function DetailOfNotes() {
  const { noteTitle } = useParams();
  const { onShowToastMessage } = useToast();
  const { notes, setNotes, isSmallerScreenSize } = useNotes();
  const [searchParams] = useSearchParams();

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

  const locationPathSegments = location.pathname.split("/");
  const defaultFallbackPath = `/${locationPathSegments[1]}`;
  const prevPath = location.state?.from === "/tags" || defaultFallbackPath;
  const basePath = `${locationPathSegments[1]}`;
  const searchAndTagspage =
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/tags");
  const currentSearchString = searchParams.toString();

  const selectedNote = notes?.find((note) => note.title === noteTitle);
  const initialNoteTitleFromParamsRef = useRef(noteTitle);
  const [pendingNavigationPath, setPendingNavigationPath] = useState(null);

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
  const previousNoteRef = useRef(selectedNote);
  const skipNextDraftSaveRef = useRef(false);

  const newNoteTitle = selectedNoteTitle.trim();
  const newFullPathToNavigate = `/${basePath}/${encodeURIComponent(
    newNoteTitle
  )}`;

  useEffect(() => {
    if (!selectedNote) return;

    const prevNote = previousNoteRef.current;

    const hasUnsavedChanges =
      selectedNoteTitle !== prevNote?.title ||
      tags !== prevNote?.tags.join(", ") ||
      textContent !== prevNote?.content;

    if (
      !isSmallerScreenSize &&
      prevNote.title !== noteTitle &&
      hasUnsavedChanges &&
      !skipNextDraftSaveRef.current
    ) {
      setDraftContent(prevNote.title, selectedNoteTitle, tags, textContent);
    }

    previousNoteRef.current = selectedNote;
    skipNextDraftSaveRef.current = false;
  }, [
    isSmallerScreenSize,
    noteTitle,
    selectedNote,
    selectedNoteTitle,
    setDraftContent,
    tags,
    textContent,
  ]);

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

  const { showToastMessage } = useToast();

  // Errors
  const [errorNoteTitle, setErrorNoteTitle] = useState(null);

  //a condition that check if the save button should be disabled or not
  const isSaveDisabled = !!errorNoteTitle || !hasChanges;

  useEffect(() => {
    initialNoteTitleFromParamsRef.current = noteTitle;
  }, [noteTitle]);

  useEffect(() => {
    if (showToastMessage) return;
    if (isSmallerScreenSize) mainInfoTitleRef.current?.focus();
  }, [showToastMessage, isSmallerScreenSize]);

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

    if (!hasChanges) return;

    skipNextDraftSaveRef.current = true;
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

      setPendingNavigationPath(newFullPathToNavigate);

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

      clearDraftContent(noteTitle);
      onShowToastMessage({ text: "Note saved successfully!" });

      const navigateOptions = {
        pathname: newFullPathToNavigate,
      };

      if (searchAndTagspage) {
        if (currentSearchString) {
          navigateOptions.search = currentSearchString;
        }
      }

      navigate(navigateOptions, { replace: true });
    }
  };

  const handleArchiveNotes = function () {
    setTimeout(() => {
      mainInfoTitleRef.current?.focus(); // Return focus to the note input
    }, 0);

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

    onShowToastMessage({
      text: "Note archived.",
      link: "Archived Notes",
      ariaLabelText: "Go to Archived Notes",
    });

    const newFullPathToNavigate = `/${basePath}`;

    setPendingNavigationPath(
      !isSmallerScreenSize ? newFullPathToNavigate : "/all-notes"
    );
    const navigateOptions = {
      pathname: newFullPathToNavigate,
    };

    if (searchAndTagspage) {
      if (currentSearchString) {
        navigateOptions.search = currentSearchString;
      }
    }

    if (!isSmallerScreenSize) {
      navigate(navigateOptions, { replace: true });
    } else {
      navigate("/all-notes", { replace: true });
    }
  };

  const handlelRestoreArchivedNotes = function () {
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

    onShowToastMessage({
      text: "Note restored to active notes.",
      link: "All Notes",
      ariaLabelText: "Go to All Notes",
    });

    const newFullPathToNavigate = `/${basePath}`;

    setPendingNavigationPath(
      !isSmallerScreenSize ? newFullPathToNavigate : "/archived-notes"
    );

    const navigateOptions = {
      pathname: newFullPathToNavigate,
    };

    if (searchAndTagspage) {
      if (currentSearchString) {
        navigateOptions.search = currentSearchString;
      }
    }

    if (!isSmallerScreenSize) {
      navigate(navigateOptions, { replace: true });
    } else {
      navigate("/archived-notes", { replace: true });
    }
  };

  const handleDeleteNote = function () {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.title !== selectedNote.title)
    );

    onShowToastMessage({
      text: "Note permanently deleted.",
    });

    const newFullPathToNavigate = `/${basePath}`;

    setPendingNavigationPath(newFullPathToNavigate);

    const navigateOptions = {
      pathname: newFullPathToNavigate,
    };

    if (searchAndTagspage) {
      if (currentSearchString) {
        navigateOptions.search = currentSearchString;
      }
    }

    navigate(navigateOptions, { replace: true });

    clearDraftContent(initialNoteTitleFromParamsRef.current);
  };

  const handleCancelButton = function (e) {
    e.preventDefault();

    const navigateOptions = {
      pathname: prevPath,
    };

    if (searchAndTagspage) {
      if (currentSearchString) {
        navigateOptions.search = currentSearchString;
      }
    }
    clearDraftContent(noteTitle);
    navigate(navigateOptions);
  };

  const handleDesktopCancelButton = function (e) {
    e.preventDefault();
    clearDraftContent(initialNoteTitleFromParamsRef.current);
    setSelectedNoteTitle(selectedNote.title);
    setTags(selectedNote.tags.join(", "));
    setTextContent(selectedNote.content);
  };

  const handleGoBackBtn = function (e) {
    e.preventDefault();

    const navigateOptions = {
      pathname: prevPath,
    };

    if (searchAndTagspage) {
      if (currentSearchString) {
        navigateOptions.search = currentSearchString;
      }
    }

    if (
      textContent !== selectedNote.content ||
      tags !== selectedNote.tags.join(", ") ||
      selectedNoteTitle !== selectedNote.title
    ) {
      setDraftContent(noteTitle, selectedNoteTitle, tags, textContent);
    } else {
      clearDraftContent(noteTitle);
    }

    navigate(navigateOptions);
  };

  useEffect(
    function () {
      if (!pendingNavigationPath && notes !== null && notes !== undefined)
        if (!selectedNote) {
          navigate(prevPath, { replace: true });
        }
    },
    [navigate, prevPath, selectedNote, notes, pendingNavigationPath]
  );

  useEffect(
    function () {
      if (pendingNavigationPath) {
        if (location.pathname === pendingNavigationPath) {
          setPendingNavigationPath(null);
        }
      }
    },
    [location.pathname, pendingNavigationPath]
  );

  if (pendingNavigationPath) return <SpinnerFullPage />;

  return (
    <form
      action={"#"}
      className="flex-auto flex flex-col md:w-full
     md:max-w-[45rem] md:mx-auto xl:mx-0 xl:max-w-none xl:flex-row xl:pr-8"
    >
      {/* Mobile Header Controller */}
      {isSmallerScreenSize && (
        <NoteActions
          onGoBack={handleGoBackBtn}
          onDeleteNote={handleDeleteNote}
          isArchived={selectedNote?.isArchived}
          onRestoreNote={handlelRestoreArchivedNotes}
          onArchiveNote={handleArchiveNotes}
          onCancel={handleCancelButton}
          onSave={handleSaveNotes}
          fontSize={"text-sm"}
        />
      )}

      {/* xl:border-r border-border-separator */}
      <div className="xl:pb-5 flex flex-col flex-auto xl:px-6">
        {/* Note title information */}
        <div className={"text-xs border-b border-border-separator"}>
          <div className={`pt-3 xl:pt-5 ${errorNoteTitle ? "pb-3" : ""}`}>
            <h1 tabIndex="-1" id="note-title-heading" className="sr-only">
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
              className={`focus:outline-none ${
                !errorNoteTitle && "pb-3"
              } text-2xl w-full
           placeholder:text-input-new-note-title-placeholder-color resize-none
            text-text-primary font-bold  -tracking-150 `}
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

          <div className="flex">
            <div className="text-neutral700 w-full grid grid-cols-[auto_1fr] items-center gap-x-7 gap-y-2 pb-3 md:pb-4">
              <label
                htmlFor="tagValue"
                className="self-start flex items-center space-x-1.5 text-text-label md:text-sm"
              >
                <TagIcon width={"w-4"} />
                <span>Tags</span>
              </label>

              <TextareaAutosize
                name="tagValue"
                id="tagValue"
                className="w-full focus:outline-none  
                placeholder:text-new-note-input-placeholder-color resize-none overflow-y-auto max-h-20 text-text-value md:text-sm"
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
                      <span className=" md:text-sm">Status</span>
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
                    <span className="md:text-sm"> Last edited</span>
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
          className="focus:outline-none flex-auto overflow-y-auto resize-none w-full pt-3   text-sm leading-50 -tracking-50 text-note-content-text pb-3 "
        ></textarea>

        {/* Desktop Save Note and Cancel Button */}
        {!isSmallerScreenSize && (
          <NoteActions
            onCancel={handleDesktopCancelButton}
            onSave={handleSaveNotes}
          />
        )}
      </div>

      {/* Desktop Archive and Delete buttons*/}
      <div className="hidden xl:pl-4 xl:pt-5 xl:flex flex-col gap-y-3">
        {selectedNote?.isArchived ? (
          <DesktopNoteActionButton
            icon={<RestoreIcon width={"w-5"} />}
            btn="Restore Note"
            onConfirm={handlelRestoreArchivedNotes}
          />
        ) : (
          <DesktopNoteActionButton
            icon={<ArchiveIcon width={"w-5"} />}
            title="Archive Note"
            content="Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime."
            btn="Archive Note"
            onConfirm={handleArchiveNotes}
          />
        )}

        <DesktopNoteActionButton
          icon={<DeleteIcon width={"w-5"} />}
          title="Delete Note"
          content="Are you sure you want to permanently delete this note? This actions cannot be undone."
          btn="Delete Note"
          onConfirm={handleDeleteNote}
        />
      </div>
    </form>
  );
}

function DesktopNoteActionButton({
  icon,
  title = "",
  content = "",
  btn,
  onConfirm,
}) {
  const { openModal } = useModal();

  return (
    <button
      className="border-2 focusable-ring border-desktop-note-action-button-border rounded-lg text-desktop-note-action-button text-sm -tracking-50 flex items-center gap-2 py-3 px-4 w-[15.125rem]"
      onClick={(e) => {
        e.preventDefault();
        btn !== "Restore Note"
          ? openModal(
              {
                icon: icon,
                title: title,
                content: content,
                btn: btn,
                onConfirm: onConfirm,
              },
              e
            )
          : onConfirm();
      }}
    >
      {icon}
      <span>{btn}</span>
    </button>
  );
}

function DetailInfoElements({ labelIconValue, labelType = "", content }) {
  return (
    <>
      <LabeledIconText>{labelIconValue}</LabeledIconText>
      <span
        className={`md:text-sm ${
          labelType === "last" ? "text-text-value-last" : "text-text-value"
        }`}
      >
        {content}
      </span>
    </>
  );
}
export default DetailOfNotes;
