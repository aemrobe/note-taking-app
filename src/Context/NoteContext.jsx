import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import noteDataJson from "../assets/data.json";

const NotesContext = createContext();

function NotesProvider({ children }) {
  const [notes, setNotes] = useState(noteDataJson.notes);

  const [isSmallerScreenSize, setIsSmallerScreenSize] = useState(
    window.innerWidth < 1440
  );

  const [draftNotesContent, setDraftNotesContent] = useState({});

  const getDraftNoteContent = useCallback(
    (noteTitle) => draftNotesContent[noteTitle],
    [draftNotesContent]
  );

  const setDraftContent = useCallback(function (noteTitle, content) {
    setDraftNotesContent((prev) => {
      const drafts = {
        ...prev,
        [noteTitle]:
          content === null || content === undefined ? "" : String(content),
      };

      return drafts;
    });
  }, []);

  const clearDraftContent = useCallback(
    function (noteTitle) {
      setDraftNotesContent((prev) => {
        const drafts = { ...prev };

        delete drafts[noteTitle];

        return drafts;
      });
    },
    [setDraftNotesContent]
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
        getDraftNoteContent,
        setDraftContent,
        clearDraftContent,
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
