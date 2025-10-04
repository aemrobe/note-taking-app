import { useModal } from "../Context/ModalContext";
import { useNotes } from "../Context/NoteContext";
import ArchiveIcon from "./ArchiveIcon";
import CancelBtn from "./CancelBtn";
import DeleteIcon from "./DeleteIcon";
import GoBackBtn from "./GoBackBtn";
import RestoreIcon from "./RestoreIcon";
import SaveBtn from "./SaveBtn";

function NoteActions({
  onGoBack = "",
  onDeleteNote = "",
  isArchived = "",
  onArchiveNote = "",
  onRestoreNote = "",
  onCancel,
  onSave,
}) {
  const { openModal } = useModal();
  const { isSmallerScreenSize } = useNotes();

  return (
    <>
      <nav
        aria-label="Note Actions"
        className={`flex items-center space-x-4 xl:space-x-0 pt-5 pb-3 text-button-secondary-text border-b border-border-separator leading-[1.3] text-sm  xl:border-t xl:border-b-0  xl:pt-4 xl:pb-0 xl:gap-4`}
      >
        {/* Go Back Button */}
        {onGoBack && <GoBackBtn onClick={onGoBack}>Go Back</GoBackBtn>}

        {/* Delete Button */}
        {onDeleteNote && (
          <button
            aria-label="Delete Note"
            className="ml-auto focusable-ring"
            onClick={(e) => {
              e.preventDefault();
              openModal(
                {
                  icon: <DeleteIcon width={"w-6"} />,
                  title: "Delete Note",
                  content:
                    "Are you sure you want to permanently delete this note? This actions cannot be undone.",
                  btn: "Delete Note",
                  onConfirm: onDeleteNote,
                },
                e
              );
            }}
          >
            <DeleteIcon width={"w-icon-small"} />
          </button>
        )}
        {/* Restore & Archive Button */}
        {onArchiveNote &&
          (isArchived ? (
            <button
              aria-label="Restore Note"
              onClick={(e) => {
                e.preventDefault();
                onRestoreNote();
              }}
              className="focusable-ring"
            >
              <RestoreIcon width={"w-icon-small"} />
            </button>
          ) : (
            <button
              aria-label="Archive Note"
              className="focusable-ring"
              onClick={(e) => {
                e.preventDefault();
                openModal({
                  icon: <ArchiveIcon width={"w-6"} />,
                  title: "Archive Note",
                  content:
                    "Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.",
                  btn: "Archive Note",
                  onConfirm: onArchiveNote,
                });
              }}
            >
              <ArchiveIcon width={"w-icon-small"} />
            </button>
          ))}
        {isSmallerScreenSize ? (
          <>
            <CancelBtn
              onClick={onCancel}
              marginLeft={!onRestoreNote && onGoBack ? "ml-auto" : ""}
            />
            <SaveBtn onClick={onSave} />{" "}
          </>
        ) : (
          <>
            <SaveBtn onClick={onSave} />

            <CancelBtn
              onClick={onCancel}
              marginLeft={!onRestoreNote && onGoBack ? "ml-auto" : ""}
            />
          </>
        )}
      </nav>
    </>
  );
}

export default NoteActions;
