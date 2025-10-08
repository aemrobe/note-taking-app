import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ActionModal from "../Components/modals/ActionModal";
import Portal from "../Components/modals/Portal";

const ModalContext = createContext();

function ModalProvider({ children, appRef }) {
  const [modalProps, setModalProps] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lastFocusableElement, setLastFocusableElement] = useState(null);

  const openModal = useCallback(function (modalPropsContent) {
    setModalProps(modalPropsContent);
    setLastFocusableElement(document.activeElement);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(function () {
    setModalProps({});
    setIsOpen(false);
    setLastFocusableElement(null);
  }, []);

  const restoreFocus = useCallback(
    function () {
      const elementToFocus = lastFocusableElement;

      if (elementToFocus) {
        setTimeout(function () {
          elementToFocus.focus();
        }, 20);
      }
    },
    [lastFocusableElement]
  );

  const value = {
    openModal,
    closeModal,
  };

  useEffect(() => {
    if (appRef && appRef.current) {
      if (isOpen) {
        appRef.current.setAttribute("inert", "");
      } else {
        appRef.current.removeAttribute("inert");
      }
    }
  }, [isOpen, appRef]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isOpen && modalProps && (
        <Portal>
          <ActionModal
            modalProps={modalProps}
            onClose={closeModal}
            onCancel={restoreFocus}
          />
        </Portal>
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
