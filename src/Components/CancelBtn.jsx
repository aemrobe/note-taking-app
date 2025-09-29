function CancelBtn({ onClick, marginLeft = "" }) {
  return (
    <button
      onClick={onClick}
      className={`focusable-ring ${marginLeft} 2xl:rounded-lg 2xl:py-3 2xl:px-4 2xl:bg-desktop-cancel-button-bg
        2xl:text-desktop-cancel-button-text 2xl:-tracking-50 `}
    >
      Cancel
    </button>
  );
}

export default CancelBtn;
