import ArrowLeftIcon from "./ArrowLeftIcon";

function GoBackBtn({ onClick, children, ariaLabel = "" }) {
  return (
    <button
      className="focusable-ring flex items-center text-sm space-x-1 "
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <ArrowLeftIcon width={"w-icon-small"} />
      <span className="-tracking-50">{children}</span>
    </button>
  );
}

export default GoBackBtn;
