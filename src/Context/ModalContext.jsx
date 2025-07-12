import { createContext, useCallback, useContext, useState } from "react";
import ActionModal from "../Components/ActionModal";

const ModalContext = createContext();

function ModalProvider({ children }) {
  const [modalProps, setModalProps] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(function (modalPropsContent) {
    setModalProps(modalPropsContent);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(function () {
    setModalProps({});
    setIsOpen(false);
  }, []);

  const value = {
    openModal,
    closeModal,
  };

  console.log("modalprops", modalProps);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isOpen && modalProps && (
        <ActionModal modalProps={modalProps} onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
}

function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined)
    throw new Error(
      "You are using a modal context outside of the modal provider!!"
    );

  return context;
}

export { ModalProvider, useModal };
