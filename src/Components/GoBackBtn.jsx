import ArrowLeftIcon from "./ArrowLeftIcon";

function GoBackBtn({ onClick, children, ariaLabel = "" }) {
  const ariaProps = {};

  if (ariaLabel && ariaLabel.trim().length > 0) {
    ariaProps["aria-label"] = ariaLabel;
  }

  return (
    <button
      className="focusable-ring flex items-center text-sm space-x-1 "
      onClick={onClick}
      {...ariaProps}
    >
      <ArrowLeftIcon width={"w-icon-small"} />
      <span className="-tracking-50">{children}</span>
    </button>
  );
}

export default GoBackBtn;
