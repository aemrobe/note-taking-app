function FilterStatusMessage({
  filterTexts,
  marginBottom = "",
  lastText,
  children,
}) {
  return (
    <p
      className={`text-sm leading-50  -tracking-50 text-filter-status-message-text ${marginBottom}`}
    >
      {children}
      <span className="bg-transparent text-filter-status-highlight-text">
        {filterTexts}
      </span>{" "}
      {lastText}
    </p>
  );
}

export default FilterStatusMessage;
