function ActionModal({ modalProps, onClose }) {
  const { icon, title, content, btn, onConfirm } = modalProps;

  const handleConfirmBtn = function () {
    if (onConfirm) {
      onConfirm();
    }

    onClose();
  };

  const handleCloseBtn = function () {
    onClose();
  };

  return (
    <div className="fixed z-30 inset-0 bg-action-modal-overlay-background/50 flex justify-center items-center px-4">
      <div className="max-w-[27.5rem] bg-action-modal-dialog-background rounded-xl border border-action-modal-dialog-border">
        <div className="p-5 flex space-x-4 items-start text-neutral950 border-b border-action-modal-divider">
          <span className="bg-action-modal-icon-wrapper-background text-action-modal-icon py-[0.468rem] px-2 rounded-lg">
            {icon}
          </span>

          <div>
            <h2 className="tracking-[0.0187em] mb-1.5 font-semibold text-action-modal-title-text">
              {title}
            </h2>

            <p className="text-sm text-action-modal-content-text leading-50 tracking-50 font-normal">
              {content}
            </p>
          </div>
        </div>

        <span className="ml-auto py-4 pr-5 flex space-x-4 items-center justify-end text-sm">
          <ActionBtn
            backgroundColor={"bg-action-button-cancel-background"}
            color={"text-action-button-cancel-text"}
            onClick={handleCloseBtn}
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
          >
            {btn}
          </ActionBtn>
        </span>
      </div>
    </div>
  );
}

function ActionBtn({ backgroundColor, children, color, onClick }) {
  return (
    <button
      className={`${backgroundColor} ${color} py-3 px-4 rounded-lg`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default ActionModal;
