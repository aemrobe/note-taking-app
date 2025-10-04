import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  const createTagSearchParams = useCallback((tags) => {
    const newSearchParams = new URLSearchParams();

    tags.forEach((tag) => newSearchParams.append("tag", tag));

    return newSearchParams;
  }, []);

  // Array which contain all the selected tags
  const selectedTags = useMemo(() => {
    return searchParams.getAll("tag");
  }, [searchParams]);

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

    //updating the tags for the mobile view
    setSearchParams((prev) => {
      const newSearchParams = new URLSearchParams(prev);

      newSearchParams.delete("tag");

      nextSelectedTags.forEach((tag) => newSearchParams.append("tag", tag));

      return newSearchParams;
    });
  };

  useEffect(
    function () {
      const savedTags = JSON.parse(localStorage.getItem(localStorageTagKey));

      if (
        isOnTagPage &&
        savedTags?.length > 0 &&
        searchParams.getAll("tag").length === 0
      ) {
        const newSearchParams = createTagSearchParams(savedTags);

        setSearchParams(newSearchParams, { replace: true });
      }
    },
    [searchParams, setSearchParams, isOnTagPage, createTagSearchParams]
  );

  useEffect(
    function () {
      if (
        !isSmallerScreenSize &&
        selectedTags.length > 0 &&
        !pathMatch("/tags")
      ) {
        const tagSearchParams = createTagSearchParams(selectedTags).toString();

        navigate(`/tags?${tagSearchParams}`, { replace: true });
      } else if (
        !isSmallerScreenSize &&
        selectedTags.length === 0 &&
        pathMatch("/tags")
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
      pathMatch,
    ]
  );

  useEffect(
    function () {
      if (!isSmallerScreenSize || pathMatch("/tags")) {
        localStorage.setItem(localStorageTagKey, JSON.stringify(selectedTags));
      }
    },
    [location.pathname, isSmallerScreenSize, selectedTags, pathMatch]
  );

  const value = {
    selectedTags,
    tagLists,
    onTagClick: handleTagClick,
    filteredNotes,
    isOnTagPage,
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
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
