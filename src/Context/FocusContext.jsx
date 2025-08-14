import { createContext, useCallback, useContext, useRef } from "react";

const FocusContext = createContext();

function FocusProvider({ children }) {
  const createNewNoteButtonRef = useRef(null);

  const setFocus = useCallback(function () {
    if (createNewNoteButtonRef.current) {
      createNewNoteButtonRef.current.focus();
    }
  }, []);

  return (
    <FocusContext.Provider value={{ createNewNoteButtonRef, setFocus }}>
      {children}
    </FocusContext.Provider>
  );
}

function useFocus() {
  const context = useContext(FocusContext);

  if (context === undefined) {
    throw new Error(
      "You're using a focus context outside of the focus provider"
    );
  }

  return context;
}

export { FocusProvider, useFocus };
