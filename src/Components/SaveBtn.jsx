function SaveBtn({ onClick, isError, isSaveDisabled = false }) {
  const showToolTipAndAccessibility = isSaveDisabled && !isError;

  return (
    <span
      tabIndex={showToolTipAndAccessibility ? "0" : undefined}
      role={showToolTipAndAccessibility ? "button" : undefined}
      aria-label={
        showToolTipAndAccessibility ? "No changes to save" : "Save Note"
      }
      aria-disabled={isSaveDisabled}
      className={`${
        showToolTipAndAccessibility && "save-btn-wrapper"
      } relative focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2`}
      data-tooltip="No changes to save"
    >
      <button
        disabled={isSaveDisabled}
        className="focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2 text-button-primary-text disabled:text-button-primary-text/50"
        onClick={onClick}
      >
        Save Note
      </button>
    </span>
  );
}

export default SaveBtn;
