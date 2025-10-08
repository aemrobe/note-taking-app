import InfoIcon from "../icons/InfoIcon";

function Error({ error, marginTop, id = "" }) {
  return (
    <div
      className={`${marginTop} flex items-center space-x-2 text-error`}
      id={id}
    >
      <InfoIcon width={"w-4"} />
      <p className="text-xs leading-[1.4] tracking-[0]">{error}</p>
    </div>
  );
}

export default Error;
