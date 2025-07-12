import ArrowLeftIcon from "./ArrowLeftIcon";

function GoBackBtn({ onClick }) {
  return (
    <button className="flex items-center text-sm space-x-1 " onClick={onClick}>
      <ArrowLeftIcon width={"w-icon-small"} />
      <span className="-tracking-50">Go Back</span>
    </button>
  );
}

export default GoBackBtn;
