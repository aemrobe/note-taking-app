import { useEffect } from "react";
import CloseIcon from "./CloseIcon";
import IconCheckMark from "./IconCheckMark";
import { NavLink } from "react-router";

const TOAST_DURATION_MS = 3000; //3 sec

function ToastMessage({ toastMessageContent, onClose }) {
  const { text, link = "" } = toastMessageContent;

  const path = link
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-");

  useEffect(
    function () {
      const timer = setTimeout(
        function () {
          onClose();
        },
        [TOAST_DURATION_MS]
      );

      return () => {
        clearTimeout(timer);
      };
    },
    [text, onClose]
  );

  return (
    <div className="fixed right-4 bottom-[4.75rem] border border-neutral200 text-neutral950 text-xs -tracking-50 flex  space-x-2 items-center p-2 rounded-lg ">
      <IconCheckMark width={"w-4"} />

      <span className="mr-11"> {text}</span>

      {link && (
        <NavLink
          to={`/${path}`}
          className="underline underline-offset-2 decoration-1 decoration-neutral950"
          onClick={onClose}
        >
          {link}
        </NavLink>
      )}

      <button className="text-neutral400" onClick={onClose}>
        <CloseIcon width={"w-4"} />
      </button>
    </div>
  );
}

export default ToastMessage;
