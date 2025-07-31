import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { useNotes } from "./NoteContext";
import { localStorageTagKey } from "../config/constants";

const TagContext = createContext();

function TagProvider({ children }) {
  const { notes } = useNotes();

  const location = useLocation();

  const isOnTagPage = location.pathname === "/tags";

  const [searchParams, setSearchParams] = useSearchParams();
  const [uiMode, setUiMode] = useState("tagSelection");

  // Array which contain all the selected tags
  const selectedTags = useMemo(() => {
    return searchParams.getAll("tag");
  }, [searchParams]);

  useEffect(
    function () {
      if (!isOnTagPage) return;

      localStorage.setItem(localStorageTagKey, JSON.stringify(selectedTags));
    },
    [selectedTags, isOnTagPage]
  );

  const filteredNotes =
    selectedTags.length === 0
      ? notes
      : notes.filter((note) =>
          selectedTags.every((tag) => note.tags.includes(tag))
        );

  const handleTagClick = function (tag) {
    let nextSelectedTags;

    if (selectedTags.includes(tag)) {
      nextSelectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      nextSelectedTags = [...selectedTags, tag];
    }

    setSearchParams(
      (prev) => {
        const newSearchParam = new URLSearchParams(prev);

        newSearchParam.delete("tag");

        nextSelectedTags.forEach((t) => newSearchParam.append("tag", t));

        return newSearchParam;
      },
      { replace: true }
    );
  };

  return (
    <TagContext.Provider
      value={{
        selectedTags,
        handleTagClick,
        filteredNotes,
        uiMode,
        setUiMode,
        isOnTagPage,
      }}
    >
      {children}
    </TagContext.Provider>
  );
}

function useTag() {
  const context = useContext(TagContext);

  if (context === undefined)
    throw new Error(
      "You're using a tag context value outside of the TagProvider"
    );

  return context;
}

export { TagProvider, useTag };
