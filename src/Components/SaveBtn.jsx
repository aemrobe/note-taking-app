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
      } relative focusable-ring`}
      data-tooltip="No changes to save"
    >
      <button
        disabled={isSaveDisabled}
        className="focusable-ring text-button-primary-text disabled:text-button-primary-text/50 xl:bg-blue-500 xl:text-white xl:disabled:text-white/50 xl:rounded-lg xl:py-3 xl:px-4 xl:-tracking-50"
        onClick={onClick}
      >
        Save Note
      </button>
    </span>
  );
}

export default SaveBtn;
