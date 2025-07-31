import { createContext, useContext, useEffect, useState } from "react";
import noteDataJson from "../assets/data.json";

const NotesContext = createContext();

function NotesProvider({ children }) {
  const [notes, setNotes] = useState(function () {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : noteDataJson.notes;
  });

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

  return (
    <NotesContext.Provider
      value={{
        notes,
        isSmallerScreenSize,
        setNotes,
        // getDraftNoteContent,
        // setDraftContent,
        // clearDraftContent,
      }}
    >
      {children}
    </NotesContext.Provider>
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
