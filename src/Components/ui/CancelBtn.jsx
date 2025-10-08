function CancelBtn({ onClick, marginLeft = "" }) {
  return (
    <button
      onClick={onClick}
      className={`focusable-ring ${marginLeft} xl:rounded-lg xl:py-3 xl:px-4 xl:bg-desktop-cancel-button-bg
        xl:text-desktop-cancel-button-text xl:-tracking-50 `}
    >
      Cancel
    </button>
  );
}

export default CancelBtn;
