import { createContext, useContext, useMemo, useState } from "react";
import { useNotes } from "./NoteContext";

const SearchContext = createContext();

function SearchProvider({ children }) {
  const { notes } = useNotes();

  const [searchInput, setSearchInput] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchInput) return notes;

    const lowerCaseSearchInput = searchInput.toLowerCase();

    return notes.filter((note) => {
      const titleMatches = note.title
        .toLowerCase()
        .includes(lowerCaseSearchInput);

      const contentMatches = note.content
        .toLowerCase()
        .includes(lowerCaseSearchInput);

      const tagMatches = note.tags.some(
        (tag) => tag.toLowerCase() === lowerCaseSearchInput
      );

      return titleMatches || contentMatches || tagMatches;
    });
  }, [notes, searchInput]);

  const value = {
    searchInput,
    setSearchInput,
    filteredNotes,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

function useSearch() {
  const context = useContext(SearchContext);

  if (context === undefined)
    throw new Error(
      "You're using a search context outside of the search Provider"
    );

  return context;
}

export { SearchProvider, useSearch };
