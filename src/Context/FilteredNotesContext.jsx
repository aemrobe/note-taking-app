import { createContext, useContext } from "react";

const FilteredNotesContext = createContext(null);

function FilteredNotesProvider({ children, notes }) {
  return (
    <FilteredNotesContext.Provider value={{ notes }}>
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
