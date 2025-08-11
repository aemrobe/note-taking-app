import { useModal } from "../Context/ModalContext";
import ArchiveIcon from "./ArchiveIcon";
import CancelBtn from "./CancelBtn";
import DeleteIcon from "./DeleteIcon";
import GoBackBtn from "./GoBackBtn";
import RestoreIcon from "./RestoreIcon";
import SaveBtn from "./SaveBtn";

function NoteActions({
  onGoBack,
  onDeleteNote = "",
  isArchived = "",
  onArchiveNote = "",
  onRestoreNote = "",
  isSaveDisabled = false,
  onCancel,
  onSave,
  isError,
}) {
  const { openModal } = useModal();

  return (
    <>
      <nav
        aria-label="Note Actions"
        className={`flex items-center space-x-4 pt-5 pb-3 text-button-secondary-text border-b border-border-separator leading-[1.3] text-sm`}
      >
        {/* Go Back Button */}
        <GoBackBtn onClick={onGoBack}>Go Back</GoBackBtn>
        {/* Delete Button */}
        {onDeleteNote && (
          <button
            aria-label="Delete Note"
            className="ml-auto focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2"
            onClick={(e) => {
              e.target.blur();
              e.preventDefault();
              openModal({
                icon: <DeleteIcon width={"w-6"} />,
                title: "Delete Note",
                content:
                  "Are you sure you want to permanently delete this note? This actions cannot be undone.",
                btn: "Delete Note",
                onConfirm: onDeleteNote,
              });
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
                e.target.blur();
                e.preventDefault();
                onRestoreNote();
              }}
              className="focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2"
            >
              <RestoreIcon width={"w-icon-small"} />
            </button>
          ) : (
            <button
              aria-label="Archive Note"
              className="focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2"
              onClick={(e) => {
                e.target.blur();
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
        <CancelBtn
          onClick={onCancel}
          marginLeft={!onRestoreNote && "ml-auto"}
        />

        <SaveBtn
          onClick={onSave}
          isSaveDisabled={isSaveDisabled}
          isError={isError}
        />
      </nav>
    </>
  );
}

export default NoteActions;
