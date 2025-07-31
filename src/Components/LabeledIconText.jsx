function LabeledIconText({ children, padding = "", fontSize = "" }) {
  return (
    <span
      className={`flex items-center space-x-1.5 text-text-label ${padding} ${fontSize}`}
    >
      {children}
    </span>
  );
}

export default LabeledIconText;
