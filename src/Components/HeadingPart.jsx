function HeadingPart({ title, text }) {
  return (
    <>
      <span className="text-filter-status-text">{title} </span>
      <span className="text-text-primary">{text}</span>
    </>
  );
}

export default HeadingPart;
