import { createContext, useCallback, useContext, useState } from "react";
import ToastMessage from "../Components/modals/ToastMessage";

const generateUniqueId = () => Date.now() + Math.random();

const ToastContext = createContext();

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const handleCloseToastMessage = useCallback(function (id) {
    setToasts((prevToasts) => {
      if (prevToasts.length === 1 && prevToasts[0].id === id) {
        setTimeout(() => {
          const mainHeading = document.querySelector('h1[tabIndex="-1"]');

          if (mainHeading) {
            mainHeading.focus();
          }
        }, 50);
      }
      return prevToasts.filter((toast) => toast.id !== id);
    });
  }, []);

  const handleShowToastMessage = useCallback(function (content) {
    const id = generateUniqueId();

    setToasts((prevToasts) => [{ id, ...content }, ...prevToasts]);
  }, []);

  const value = {
    onShowToastMessage: handleShowToastMessage,
  };

  return (
    <ToastContext.Provider value={value}>
      <div>{children}</div>

      {toasts.length > 0 && (
        <div className="fixed right-4 md:right-8 xl:right-[6.625rem] bottom-[4.75rem] md:bottom-[6.625rem] xl:bottom-[4.0625rem] flex flex-col space-y-2">
          {toasts.map((toast) => (
            <ToastMessage
              key={toast.id}
              toastMessageContent={toast}
              onClose={handleCloseToastMessage}
              toastId={toast.id}
            />
          ))}
        </div>
      )}
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
