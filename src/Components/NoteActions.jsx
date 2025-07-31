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
  onCancel,
  onSave,
}) {
  const { openModal } = useModal();

  return (
    <div
      className={`flex items-center space-x-4 pt-5 pb-3 text-button-secondary-text border-b border-border-separator leading-[1.3] text-sm`}
    >
      {/* Go Back Button */}
      <GoBackBtn onClick={onGoBack}>Go Back</GoBackBtn>

      {/* Delete Button */}
      {onDeleteNote && (
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
            onClick={(e) => {
              e.preventDefault();
              onRestoreNote();
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
                onConfirm: onArchiveNote(),
              });
            }}
          >
            <ArchiveIcon width={"w-icon-small"} />
          </button>
        ))}

      <CancelBtn onClick={onCancel} marginLeft={!onRestoreNote && "ml-auto"} />
      <SaveBtn onClick={onSave} />
    </div>
  );
}

export default NoteActions;
