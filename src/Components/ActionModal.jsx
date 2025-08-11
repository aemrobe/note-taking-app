import React, { useEffect, useRef } from "react";

function ActionModal({ modalProps, onClose }) {
  const { icon, title, content, btn, onConfirm } = modalProps;

  const modalRef = useRef(null);

  const cancelBtn = useRef(null);
  const lastFocusableElementRef = useRef(null);

  const titleId = "modal-title";
  const contentId = "modal-content";

  const handleConfirmBtn = function () {
    if (onConfirm) {
      onConfirm();
    }

    onClose();
  };

  const handleCloseBtn = function () {
    onClose();
  };

  useEffect(
    function () {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }

        if (e.key === "Tab") {
          const firstElement = cancelBtn.current;
          const lastElement = lastFocusableElementRef.current;

          if (!firstElement || !lastElement) return;

          //when the user press the shift + tabKey while they are on the first interactive element, it takes them to the last interactive element
          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }

          //when the user press the tabKey while they are on the last interactive element, it takes them to the first interactive element
          if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => document.removeEventListener("keydown", handleKeyDown);
    },
    [onClose]
  );

  useEffect(() => {
    if (cancelBtn.current) {
      cancelBtn.current.focus();
    }
  }, []);

  return (
    <div className="fixed z-30 inset-0 bg-action-modal-overlay-background/50 flex justify-center items-center px-4">
      <div
        className="max-w-[27.5rem] bg-action-modal-dialog-background rounded-xl border border-action-modal-dialog-border"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={contentId}
        tabIndex={-1}
        ref={modalRef}
      >
        <div className="p-5 flex space-x-4 items-start text-neutral950 border-b border-action-modal-divider">
          <span className="bg-action-modal-icon-wrapper-background text-action-modal-icon py-[0.468rem] px-2 rounded-lg">
            {icon}
          </span>

          <div>
            <h2
              id={titleId}
              className="tracking-[0.0187em] mb-1.5 font-semibold text-action-modal-title-text"
            >
              {title}
            </h2>

            <p
              id={contentId}
              className="text-sm text-action-modal-content-text leading-50 tracking-50 font-normal"
            >
              {content}
            </p>
          </div>
        </div>

        <span className="ml-auto py-4 pr-5 flex space-x-4 items-center justify-end text-sm">
          <ActionBtn
            backgroundColor={"bg-action-button-cancel-background"}
            color={"text-action-button-cancel-text"}
            onClick={handleCloseBtn}
            ref={cancelBtn}
          >
            Cancel
          </ActionBtn>

          <ActionBtn
            backgroundColor={`${
              btn === "Delete Note"
                ? "bg-action-button-delete-background"
                : "bg-action-button-archive-background"
            }`}
            color={`${
              btn === "Delete Note"
                ? "text-action-button-delete-text"
                : "text-action-button-archive-text"
            }`}
            onClick={handleConfirmBtn}
            ref={lastFocusableElementRef}
          >
            {btn}
          </ActionBtn>
        </span>
      </div>
    </div>
  );
}

const ActionBtn = React.forwardRef(function ActionBtn(
  { backgroundColor, children, color, onClick },
  ref
) {
  return (
    <button
      className={`${backgroundColor} ${color} py-3 px-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2`}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default ActionModal;
