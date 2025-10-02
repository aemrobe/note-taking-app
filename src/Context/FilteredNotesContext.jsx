import { createContext, useContext } from "react";

const FilteredNotesContext = createContext(null);

function FilteredNotesProvider({ children, notes }) {
  const value = { notes };

  return (
    <FilteredNotesContext.Provider value={value}>
      {children}
    </FilteredNotesContext.Provider>
  );
}

function useFilteredNotes() {
  const context = useContext(FilteredNotesContext);

  if (context === undefined) {
    throw new Error(
      "useFilteredNotes must be used within a filteredNotesProvider"
    );
  }

  return context;
}

export { FilteredNotesProvider, useFilteredNotes };
