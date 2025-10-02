import { useCallback, useEffect, useRef } from "react";
import CloseIcon from "./CloseIcon";
import IconCheckMark from "./IconCheckMark";
import { NavLink } from "react-router";
import { TOAST_DURATION_MS } from "../config/constants";

function ToastMessage({ toastMessageContent, onClose }) {
  const { text, link = "", ariaLabelText = "" } = toastMessageContent;

  const linkRef = useRef();
  const closeButtonRef = useRef();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(
    function () {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [handleKeyDown]
  );

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
    <div className="border border-toast-border fixed right-4 md:right-8 xl:right-[6.625rem] bottom-[4.75rem] md:bottom-[6.625rem] xl:bottom-[4.0625rem] md:w-[24.375rem] bg-toast-background text-xs -tracking-50 flex space-x-2  items-center md:justify-between p-2 rounded-lg z-50 ">
      <span className="flex space-x-2 items-center">
        <IconCheckMark width={"w-4"} color="text-toast-chekmark-icon" />

        <span className="mr-9 text-toast-text" role="alert">
          {" "}
          {text}
        </span>
      </span>

      <span className="flex space-x-2  items-center">
        {link && (
          <NavLink
            to={`/${path}`}
            className="focusable-ring  underline underline-offset-2 decoration-1 text-toast-link-text decoration-toast-link-underline"
            aria-label={`${ariaLabelText}`}
            onClick={onClose}
            ref={linkRef}
          >
            <span className="sr-only">{ariaLabelText}</span>
            <span aria-hidden="true"> {link}</span>
          </NavLink>
        )}

        <button
          className="focusable-ring  text-toast-close-button-icon"
          onClick={onClose}
          aria-label="Close notification"
          ref={closeButtonRef}
        >
          <CloseIcon width={"w-4"} />
        </button>
      </span>
    </div>
  );
}

export default ToastMessage;
