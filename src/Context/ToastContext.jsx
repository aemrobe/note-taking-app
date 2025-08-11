import { createContext, useCallback, useContext, useState } from "react";
import ToastMessage from "../Components/ToastMessage";

const ToastContext = createContext();

function ToastProvider({ children }) {
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [toastMessageContent, setToastMessageContent] = useState({});
  const [onCloseCallback, setOnCloseCallback] = useState(null);

  const handleShowToastMessage = useCallback(function (
    content,
    callback = null
  ) {
    setShowToastMessage(true);
    setToastMessageContent(content);
    setOnCloseCallback(() => callback);
  },
  []);

  const handleCloseToastMessage = useCallback(
    function () {
      setShowToastMessage(false);
      setToastMessageContent({});

      if (onCloseCallback) {
        onCloseCallback();
        setOnCloseCallback(null);
      }
    },
    [onCloseCallback]
  );

  const value = {
    handleShowToastMessage,
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
