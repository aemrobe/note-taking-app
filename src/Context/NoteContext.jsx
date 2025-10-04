import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import noteDataJson from "../assets/data.json";
import { useLocation } from "react-router";
import { localStorageNotesKey, XL_BREAKPOINT_REM } from "../config/constants";

const NotesContext = createContext();

const getRoomRemSize = () => {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
};

function NotesProvider({ children }) {
  const location = useLocation();
  const [lastFocusableElement, setLastFocusableElement] = useState();
  const [notes, setNotes] = useState(function () {
    const savedNotes = localStorage.getItem(localStorageNotesKey);
    return savedNotes ? JSON.parse(savedNotes) : noteDataJson.notes;
  });
  const [isSmallerScreenSize, setIsSmallerScreenSize] = useState(() => {
    // const
    const rootRemSize = getRoomRemSize();

    const currentRemWidth = window.innerWidth / rootRemSize;

    return currentRemWidth < XL_BREAKPOINT_REM;
  });

  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  const previousPathRef = useRef("/all-notes");

  const previousPath = previousPathRef.current;

  useEffect(
    function () {
      if (!pathMatch("/search") && !pathMatch("/tags")) {
        previousPathRef.current = location.pathname;
      }
    },
    [location.pathname, pathMatch]
  );

  useEffect(
    function () {
      localStorage.setItem("notes", JSON.stringify(notes));
    },
    [notes]
  );

  useEffect(
    function () {
      const handleResize = function () {
        const rootRemSize = getRoomRemSize();

        const currentRemWidth = window.innerWidth / rootRemSize;

        const newIsSmallerScreenSize = currentRemWidth < XL_BREAKPOINT_REM;

        if (newIsSmallerScreenSize !== isSmallerScreenSize) {
          setIsSmallerScreenSize(currentRemWidth < XL_BREAKPOINT_REM);
        }
      };

      const intervalId = setInterval(handleResize, 500);

      window.addEventListener("resize", handleResize);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("resize", handleResize);
      };
    },
    [isSmallerScreenSize]
  );

  const value = {
    notes,
    isSmallerScreenSize,
    previousPath,
    setNotes,
    lastFocusableElement,
    setLastFocusableElement,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

function useNotes() {
  const context = useContext(NotesContext);

  if (context === undefined)
    throw new Error(
      "You are using a notes context outside of the notesProvider"
    );

  return context;
}

export { NotesProvider, useNotes };
