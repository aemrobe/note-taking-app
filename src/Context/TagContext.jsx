import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useNotes } from "./NoteContext";
import { localStorageTagKey } from "../config/constants";

const TagContext = createContext();

function TagProvider({ children }) {
  const { notes, isSmallerScreenSize, previousPath } = useNotes();
  const location = useLocation();
  const isOnTagPage = location.pathname.startsWith("/tags");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(
    function () {
      const savedTags = JSON.parse(localStorage.getItem(localStorageTagKey));

      if (
        isOnTagPage &&
        savedTags?.length > 0 &&
        searchParams.getAll("tag").length === 0
      ) {
        const newSearchParams = new URLSearchParams();

        savedTags.forEach((tag) => newSearchParams.append("tag", tag));

        setSearchParams(newSearchParams, { replace: true });
      }
    },
    [searchParams, setSearchParams, isOnTagPage]
  );

  // Array which contain all the selected tags
  const selectedTags = useMemo(() => {
    return searchParams.getAll("tag");
  }, [searchParams]);

  const createTagSearchParams = useCallback((tags) => {
    const newSearchParams = new URLSearchParams();

    tags.forEach((tag) => newSearchParams.append("tag", tag));

    return newSearchParams.toString();
  }, []);

  useEffect(
    function () {
      if (
        !isSmallerScreenSize &&
        selectedTags.length > 0 &&
        !location.pathname.startsWith("/tags")
      ) {
        const tagSearchParams = createTagSearchParams(selectedTags);

        navigate(`/tags?${tagSearchParams}`, { replace: true });
      } else if (
        !isSmallerScreenSize &&
        selectedTags.length === 0 &&
        location.pathname.startsWith("/tags")
      ) {
        navigate(previousPath, { replace: true });
      }
    },
    [
      location.pathname,
      isSmallerScreenSize,
      navigate,
      selectedTags,
      previousPath,
      createTagSearchParams,
    ]
  );

  useEffect(
    function () {
      if (!isSmallerScreenSize || location.pathname.startsWith("/tags")) {
        localStorage.setItem(localStorageTagKey, JSON.stringify(selectedTags));
      }
    },
    [location.pathname, isSmallerScreenSize, selectedTags]
  );

  const tagLists = selectedTags.join(", ");
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

    //updating the localstorage with the tags
    localStorage.setItem(localStorageTagKey, JSON.stringify(nextSelectedTags));

    const isArchivedPage = location.pathname.startsWith("/archived-notes");
    const currentNotes = isArchivedPage
      ? notes.filter((note) => note.isArchived)
      : notes.filter((note) => !note.isArchived);

    const nextFilteredNotes = notes.filter((note) =>
      nextSelectedTags.every((t) => note.tags.includes(t))
    );

    //updating the tags for the mobile view
    setSearchParams((prev) => {
      const newSearchParams = new URLSearchParams(prev);

      newSearchParams.delete("tag");

      nextSelectedTags.forEach((tag) => newSearchParams.append("tag", tag));

      return newSearchParams;
    });
  };

  return (
    <TagContext.Provider
      value={{
        selectedTags,
        tagLists,
        handleTagClick,
        filteredNotes,
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
