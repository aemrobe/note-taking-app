function CancelBtn({ onClick, marginLeft = "" }) {
  return (
    <button onClick={onClick} className={`${marginLeft && marginLeft}`}>
      Cancel
    </button>
  );
}

export default CancelBtn;
