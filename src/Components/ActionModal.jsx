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
    <div className="fixed  z-30 inset-0 bg-neutral950/50 flex justify-center items-center px-4">
      <div className="max-w-[27.5rem] bg-white rounded-xl">
        <div className="p-5 flex space-x-4 items-start text-neutral950 border-b border-neutral200">
          <span className="bg-neutral100 py-[0.468rem] px-2 rounded-lg">
            {icon}
          </span>

          <div>
            <h2 className="tracking-[0.0187em] mb-1.5 font-semibold">
              {title}
            </h2>

            <p className="text-sm leading-50 tracking-50 font-normal">
              {/* Are you sure you want to permanently delete this note? This
              actions cannot be undone. */}
              {content}
            </p>
          </div>
        </div>

        <span className="ml-auto py-4 pr-5 flex space-x-4 items-center justify-end text-sm">
          <ActionBtn
            backgroundColor={"bg-neutral100"}
            color={"text-neutral600"}
            onClick={handleCloseBtn}
          >
            Cancel
          </ActionBtn>

          <ActionBtn
            backgroundColor={"bg-red500"}
            color={"text-white"}
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
