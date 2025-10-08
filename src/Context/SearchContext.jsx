import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useNotes } from "./NoteContext";
import { useCallback } from "react";
import { SEARCH_DEBOUNCE_DELAY_MS } from "../config/constants";

const SearchContext = createContext();

function SearchProvider({ children }) {
  const { notes, isSmallerScreenSize, previousPath } = useNotes();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );

  // Ref to indicate if the last URL change was initiated by our debouncer
  //This helps prevent the first useEffect from aggressively resetting the input.
  const isUserInput = useRef(false);

  const handlerSearchInputchange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    isUserInput.current = true;
  };

  const actualSearchQueryFromURL = useMemo(() => {
    return searchParams.get("query") || "";
  }, [searchParams]);

  const filteredNotes = useMemo(() => {
    if (!actualSearchQueryFromURL) return notes;

    const lowerCaseSearchInput = actualSearchQueryFromURL.toLowerCase();

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
  }, [notes, actualSearchQueryFromURL]);

  const accessibleMessageForSearchInput = useCallback(
    function () {
      if (actualSearchQueryFromURL === "") return "";
      else if (actualSearchQueryFromURL.length > 0 && filteredNotes.length > 0)
        return `All notes matching ${actualSearchQueryFromURL} are displayed below`;
      else if (
        actualSearchQueryFromURL.length > 0 &&
        filteredNotes.length === 0
      ) {
        return `No notes match your search key ${actualSearchQueryFromURL}. Try a different keyword or create a new note`;
      }
    },
    [actualSearchQueryFromURL, filteredNotes.length]
  );

  useEffect(
    function () {
      if (!isSmallerScreenSize) {
        if (
          actualSearchQueryFromURL.length > 0 &&
          !location.pathname.startsWith("/search")
        ) {
          navigate(`/search?query=${actualSearchQueryFromURL}`, {
            replace: true,
          });
        } else if (
          actualSearchQueryFromURL.length === 0 &&
          location.pathname.startsWith("/search")
        ) {
          navigate(previousPath, { replace: true });
        }
      }
    },
    [
      isSmallerScreenSize,
      location.pathname,
      navigate,
      previousPath,
      actualSearchQueryFromURL,
    ]
  );

  //Effect to sync the url from the input using a debouncer which means only update the url only after the user has stopped interacting with the input for 500ms
  useEffect(
    function () {
      const handler = setTimeout(() => {
        const currentUrlQuery = searchParams.get("query");

        if (currentUrlQuery !== searchInput.trim()) {
          const newSearchParams = new URLSearchParams(searchParams);
          const trimmedInput = searchInput.trim();

          if (trimmedInput) {
            newSearchParams.set("query", trimmedInput);
          } else {
            // This is the key change: remove the 'query' parameter when the search input is empty
            newSearchParams.delete("query");
          }

          setSearchParams(newSearchParams);
        }
      }, SEARCH_DEBOUNCE_DELAY_MS);

      return () => {
        clearTimeout(handler);
      };
    },
    [searchInput, searchParams, setSearchParams]
  );

  //Effect to sync the input from the searchParams (e.g:- from a browser forward and backbutton, bookmark navigation,direct url manipulation)
  useEffect(() => {
    const currentUrlQuery = searchParams.get("query") || "";

    if (searchInput !== currentUrlQuery && !isUserInput.current) {
      setSearchInput(currentUrlQuery);
    }

    if (isUserInput.current && searchInput === currentUrlQuery) {
      isUserInput.current = false;
    }
  }, [searchParams, searchInput]);

  const value = {
    actualSearchQueryFromURL,
    searchInput,
    onSearchInputChange: handlerSearchInputchange,
    accessibleMessageForSearchInput,
    filteredNotes,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

function useSearch() {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error(
      "You can only use the search context inside of the search provider"
    );
  }

  return context;
}

export { SearchProvider, useSearch };
