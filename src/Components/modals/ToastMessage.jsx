import { useCallback, useEffect, useRef, useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import IconCheckMark from "../icons/IconCheckMark";
import { NavLink } from "react-router";
import {
  TOAST_ANIMATION_DURATION,
  TOAST_DURATION_MS,
} from "../../config/constants";

function ToastMessage({ toastMessageContent, onClose, toastId }) {
  const { text, link = "", ariaLabelText = "" } = toastMessageContent;

  const [showToastMessage, setShowToastMessage] = useState(true);
  const linkRef = useRef();
  const closeButtonRef = useRef();

  const handleDismiss = useCallback(
    function () {
      setShowToastMessage(false);
      setTimeout(function () {
        onClose(toastId);
      }, TOAST_ANIMATION_DURATION);
    },
    [onClose, toastId]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    },
    [handleDismiss]
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
      const timer = setTimeout(function () {
        handleDismiss();
      }, TOAST_DURATION_MS);

      return () => {
        clearTimeout(timer);
      };
    },
    [handleDismiss]
  );

  return (
    <div
      className={`${
        showToastMessage ? "fade-in" : "fade-out"
      } border border-toast-border  md:w-[24.375rem] bg-toast-background text-xs -tracking-50 flex space-x-2  items-center md:justify-between p-2 rounded-lg z-50`}
    >
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
            onClick={handleDismiss}
            ref={linkRef}
          >
            <span className="sr-only">{ariaLabelText}</span>
            <span aria-hidden="true"> {link}</span>
          </NavLink>
        )}

        <button
          className="focusable-ring  text-toast-close-button-icon"
          onClick={handleDismiss}
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
