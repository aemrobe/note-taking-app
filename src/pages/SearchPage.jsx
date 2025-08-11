import { useEffect, useMemo, useRef, useState } from "react";
import EmptyNotes from "../Components/EmptyNotes";
import FilterStatusMessage from "../Components/FilterStatusMessage";
import ListOfNotes from "../Components/ListOfNotes";
import SearchIcon from "../Components/SearchIcon";

import { useNotes } from "../Context/NoteContext";
import { useSearchParams } from "react-router";
import { APP_NAME } from "../config/constants";

const SEARCH_DEBOUNCE_DELAY_MS = 500;

function SearchPage() {
  const { notes } = useNotes();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );

  // Ref to indicate if the last URL change was initiated by our debouncer
  //This helps prevent the first useEffect from aggressively resetting the input.
  const isUserInput = useRef(false);

  const handlerInputchange = (e) => {
    setSearchInput(e.target.value);
    isUserInput.current = true;
  };

  useEffect(() => {
    document.title = `Search Notes -  ${APP_NAME}`;
  }, []);

  //Effect to sync the input to the searchParams (e.g:- from a browser forward and backbutton, bookmark navigation,direct url manipulation)
  useEffect(() => {
    const currentUrlQuery = searchParams.get("query") || "";

    if (searchInput !== currentUrlQuery && !isUserInput.current) {
      setSearchInput(currentUrlQuery);
    }

    if (isUserInput.current && searchInput === currentUrlQuery) {
      isUserInput.current = false;
    }
  }, [searchParams, searchInput]);

  //Effect to sync the url from the input using a debouncer which means only update the url only after the use has stopped interacting with the input for 500ms
  useEffect(
    function () {
      const handler = setTimeout(() => {
        const currentUrlQuery = searchParams.get("query");

        if (currentUrlQuery !== searchInput.trim()) {
          const newSearchParams = new URLSearchParams(searchParams);

          newSearchParams.set("query", searchInput.trim());

          setSearchParams(newSearchParams);
        }
      }, SEARCH_DEBOUNCE_DELAY_MS);

      return () => {
        clearTimeout(handler);
      };
    },
    [searchInput, searchParams, setSearchParams]
  );

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

  return (
    <div className="text-sm -tracking-50 leading-50">
      <div className="pt-5 pb-4 bg-background-primary ">
        <h2 className="font-bold  text-2xl text-text-primary -tracking-150">
          Search
        </h2>

        <span
          className={`
            ${actualSearchQueryFromURL.length > 0 && "mb-4"}
          flex space-x-2 py-3 px-4 border border-search-input-border bg-search-input-background rounded-lg mt-4`}
        >
          <label htmlFor="search" className="text-search-icon">
            <SearchIcon width={"w-5"} />
          </label>

          <input
            value={searchInput}
            onChange={handlerInputchange}
            className="flex-auto focus:outline-none placeholder:text-search-input-placeholder text-sm -tracking-50 leading-50 text-search-input-text"
            id="search"
            type="text"
            placeholder="Search by title, content, or tags..."
          />
        </span>

        {actualSearchQueryFromURL.length > 0 && (
          <FilterStatusMessage
            filterTexts={`"${actualSearchQueryFromURL}"`}
            lastText={"displayed below"}
          >
            All notes matching{" "}
          </FilterStatusMessage>
        )}
      </div>

      {filteredNotes.length === 0 && (
        <EmptyNotes link={"create a new note."}>
          No notes match your search. Try a different keyword or create a new
          note.{" "}
        </EmptyNotes>
      )}
      <ListOfNotes notes={filteredNotes} type={"search"} />
    </div>
  );
}

export default SearchPage;
