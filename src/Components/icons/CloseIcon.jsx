function CloseIcon({ width }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={width}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6 6 12 12M18 6 6 18"
      />
    </svg>
  );
}

export default CloseIcon;
