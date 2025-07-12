import { useLocation, useNavigate, useParams } from "react-router";
import ArchiveIcon from "./ArchiveIcon";
import CancelBtn from "./CancelBtn";
import DeleteIcon from "./DeleteIcon";
import SaveBtn from "./SaveBtn";
import TagIcon from "./TagIcon";
import { useNotes } from "../Context/NoteContext";
import { useEffect, useState } from "react";
import GoBackBtn from "./GoBackBtn";
import { formatDate } from "../config/constants";
import StatusIcon from "./StatusIcon";
import LastEditedIcon from "./LastEditedIcon";
import { useModal } from "../Context/ModalContext";
import RestoreIcon from "./RestoreIcon";
import { useToast } from "../Context/ToastContext";

function DetailOfNotes() {
  const { noteTitle } = useParams();

  const {
    notes,
    setNotes,
    getDraftNoteContent,
    setDraftContent,
    clearDraftContent,
  } = useNotes();

  const navigate = useNavigate();

  const location = useLocation();

  const prevPath = location.state?.from || "/allnotes";
  const selectedNote = notes?.find((note) => note.title === noteTitle);

  const { openModal } = useModal();
  const { handleShowToastMessage } = useToast();

  const [textContent, setTextContent] = useState(function () {
    const draft = getDraftNoteContent(noteTitle);

    return draft !== undefined ? draft : selectedNote?.content || "";
  });

  const handleSaveNotes = function (e) {
    e.preventDefault();

    if (textContent === selectedNote.content) return;

    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex(
        (note) => note.title === selectedNote.title
      );

      const updatedNotes = [...prevNotes];

      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        content: textContent,
      };

      return updatedNotes;
    });

    clearDraftContent(selectedNote.title);
    handleShowToastMessage({ text: "Note saved successfully!" });
  };

  const handleArchiveNotes = function () {
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

    handleShowToastMessage({
      text: "Note archived.",
      link: "Archived Notes",
    });

    navigate(prevPath, { replace: true });
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

    handleShowToastMessage({
      text: "Note restored to active notes.",
      link: "All Notes",
    });

    navigate(prevPath, { replace: true });
  };

  const handleDeleteNote = function () {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.title !== selectedNote.title)
    );

    handleShowToastMessage({
      text: "Note permanently deleted.",
    });

    navigate(prevPath, { replace: true });
  };

  const handleCancelButton = function (e) {
    e.preventDefault();
    navigate(-1);
  };

  const handleGoBackBtn = function (e) {
    e.preventDefault();

    if (textContent !== selectedNote.content) {
      setDraftContent(selectedNote.title, textContent);
    } else {
      clearDraftContent(selectedNote.title);
    }

    navigate(-1);
  };

  useEffect(
    function () {
      {
        if (!selectedNote) navigate(prevPath, { replace: true });
      }
    },
    [navigate, prevPath, selectedNote]
  );

  if (!selectedNote) return null;

  return (
    <form action={"#"} className="flex-auto flex flex-col">
      {/* Mobile Header Controller */}
      <div className="flex items-center space-x-4 pt-5 pb-3 text-neutral600 border-b border-neutral200 leading-[1.3] text-sm">
        {/* Go Back Button */}
        <GoBackBtn onClick={handleGoBackBtn} />

        {/* Delete Button */}
        <button
          className="ml-auto"
          onClick={(e) => {
            e.preventDefault();
            openModal({
              icon: <DeleteIcon width={"w-6"} />,
              title: "Delete Note",
              content:
                "Are you sure you want to permanently delete this note? This actions cannot be undone.",
              btn: "Delete Note",
              onConfirm: handleDeleteNote,
            });
          }}
        >
          <DeleteIcon width={"w-icon-small"} />
        </button>

        {/* Restore & Archive Button */}
        {selectedNote.isArchived ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              handlelRestoreArchivedNotes();
            }}
          >
            <RestoreIcon width={"w-icon-small"} />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              openModal({
                icon: <ArchiveIcon width={"w-6"} />,
                title: "Archive Note",
                content:
                  "Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.",
                btn: "Archive Note",
                onConfirm: handleArchiveNotes,
              });
            }}
          >
            <ArchiveIcon width={"w-icon-small"} />
          </button>
        )}

        <CancelBtn onClick={handleCancelButton} />
        <SaveBtn onClick={handleSaveNotes} />
      </div>

      <div className="flex-auto flex flex-col">
        {/* Note title information */}
        <div className="text-xs">
          <h2 className="text-2xl font-bold py-3 -tracking-150">
            {selectedNote.title}
          </h2>

          <div className="flex border-b border-neutral200">
            <div className="text-neutral700 grid grid-cols-2 gap-x-7 gap-y-2  pb-3">
              <DetailInfoElements content={selectedNote.tags.join(", ")}>
                <TagIcon width={"w-4"} />
                <span>Tags</span>
              </DetailInfoElements>

              {selectedNote.isArchived && (
                <DetailInfoElements content={"Archived"}>
                  <StatusIcon width={"w-4"} />
                  <span>Status</span>
                </DetailInfoElements>
              )}

              <DetailInfoElements content={formatDate(selectedNote.lastEdited)}>
                <LastEditedIcon width={"w-4"} />
                <span> Last edited</span>
              </DetailInfoElements>
            </div>
          </div>
        </div>

        {/* Note Text Content */}
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          name="Note text"
          placeholder="Write a content of a note here"
          className=" w-full mt-3 text-sm leading-50 -tracking-50 focus:outline-none flex-auto  "
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

function DetailInfoElements({ children, content }) {
  return (
    <>
      <span className="flex items-center space-x-1.5">{children}</span>
      <span>{content}</span>
    </>
  );
}
export default DetailOfNotes;
