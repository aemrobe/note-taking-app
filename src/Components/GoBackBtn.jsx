import ArrowLeftIcon from "./ArrowLeftIcon";

function GoBackBtn({ onClick, children }) {
  return (
    <button className="flex items-center text-sm space-x-1 " onClick={onClick}>
      <ArrowLeftIcon width={"w-icon-small"} />
      <span className="-tracking-50">{children}</span>
    </button>
  );
}

export default GoBackBtn;
