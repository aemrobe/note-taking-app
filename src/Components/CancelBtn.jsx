function CancelBtn({ onClick, marginLeft = "" }) {
  return (
    <button
      onClick={onClick}
      className={`focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2 ${
        marginLeft && marginLeft
      }`}
    >
      Cancel
    </button>
  );
}

export default CancelBtn;
