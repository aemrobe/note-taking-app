import { useCallback, useEffect, useRef } from "react";
import CloseIcon from "./CloseIcon";
import IconCheckMark from "./IconCheckMark";
import { NavLink } from "react-router";

const TOAST_DURATION_MS = 3000; //3 sec

function ToastMessage({ toastMessageContent, onClose }) {
  const { text, link = "", ariaLabelText = "" } = toastMessageContent;

  const linkRef = useRef();
  const closeButtonRef = useRef();

  const focusFirstElement = () => {
    if (linkRef.current) {
      linkRef.current?.focus();
    } else if (closeButtonRef.current) {
      closeButtonRef.current?.focus();
    }
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab") {
        const hasLink = linkRef.current !== null;

        if (hasLink) {
          const isFirstElementFocussed =
            document.activeElement === linkRef.current;
          const isLastElementFocussed =
            document.activeElement === closeButtonRef.current;

          if (e.shiftKey && isFirstElementFocussed) {
            closeButtonRef.current?.focus();
            e.preventDefault();
          }

          if (!e.shiftKey && isLastElementFocussed) {
            linkRef.current?.focus();
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      }
    },
    [onClose]
  );

  useEffect(
    function () {
      document.addEventListener("keydown", handleKeyDown);

      const focusTimer = setTimeout(() => {
        focusFirstElement();
      }, 0);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        clearTimeout(focusTimer);
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
    <div className="fixed right-4 bottom-[4.75rem] bg-toast-background border border-toast-border text-xs -tracking-50 flex  space-x-2 items-center p-2 rounded-lg z-50 ">
      <IconCheckMark width={"w-4"} color="text-toast-chekmark-icon" />

      <span className="mr-11 text-toast-text"> {text}</span>

      {link && (
        <NavLink
          to={`/${path}`}
          className="focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2 underline underline-offset-2 decoration-1 text-toast-link-text decoration-toast-link-underline"
          aria-label={`${ariaLabelText}`}
          onClick={onClose}
          ref={linkRef}
        >
          <span className="sr-only">{ariaLabelText}</span>
          <span aria-hidden="true"> {link}</span>
        </NavLink>
      )}

      <button
        className="focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2 text-toast-close-button-icon"
        onClick={onClose}
        aria-label="Close notification"
        ref={closeButtonRef}
      >
        <CloseIcon width={"w-4"} />
      </button>
    </div>
  );
}

export default ToastMessage;
