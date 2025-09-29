import { createContext, useCallback, useContext, useState } from "react";
import ToastMessage from "../Components/ToastMessage";

const ToastContext = createContext();

function ToastProvider({ children }) {
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [toastMessageContent, setToastMessageContent] = useState({});

  const handleShowToastMessage = useCallback(function (content) {
    setShowToastMessage(true);
    setToastMessageContent(content);
  }, []);

  const handleCloseToastMessage = useCallback(function () {
    setShowToastMessage(false);
    setToastMessageContent({});

    setTimeout(() => {
      const mainHeading = document.querySelector('h1[tabIndex="-1"]');

      if (mainHeading) {
        mainHeading.focus();
      }
    }, 50);
  }, []);

  const value = {
    handleShowToastMessage,
    showToastMessage,
  };

  return (
    <ToastContext.Provider value={value}>
      <div aria-hidden={showToastMessage ? true : false}>{children}</div>

      <div role="status" aria-live="polite" aria-atomic="true">
        {showToastMessage && (
          <ToastMessage
            toastMessageContent={toastMessageContent}
            onClose={handleCloseToastMessage}
          />
        )}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined)
    throw new Error(
      "You are using a toast context outside of the toast provider"
    );

  return context;
}

export { ToastProvider, useToast };
