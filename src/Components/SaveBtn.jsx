function SaveBtn({ onClick }) {
  return (
    <button
      className="focusable-ring text-button-primary-text  xl:bg-blue-500 xl:text-white  xl:rounded-lg xl:py-3 xl:px-4 xl:-tracking-50"
      onClick={onClick}
    >
      Save Note
    </button>
  );
}

export default SaveBtn;
