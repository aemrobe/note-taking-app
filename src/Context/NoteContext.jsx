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

const NotesContext = createContext();

function NotesProvider({ children }) {
  const location = useLocation();
  const [lastFocusableElement, setLastFocusableElement] = useState();
  const [notes, setNotes] = useState(function () {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : noteDataJson.notes;
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

  const [isSmallerScreenSize, setIsSmallerScreenSize] = useState(
    window.innerWidth < 1440
  );

  useEffect(
    function () {
      localStorage.setItem("notes", JSON.stringify(notes));
    },
    [notes]
  );

  useEffect(function () {
    const handleResize = function () {
      setIsSmallerScreenSize(window.innerWidth < 1440);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
