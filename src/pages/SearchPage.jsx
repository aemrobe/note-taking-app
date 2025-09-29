import { useEffect, useRef } from "react";
import FilterStatusMessage from "../Components/FilterStatusMessage";
import ListOfNotes from "../Components/ListOfNotes";

import { APP_NAME } from "../config/constants";
import { useSearch } from "../Context/SearchContext";
import SearchInputBox from "../Components/SearchInputBox";
import { useNotes } from "../Context/NoteContext";

function SearchPage() {
  const pageTitle = useRef(null);
  const { isSmallerScreenSize } = useNotes();

  useEffect(
    function () {
      pageTitle.current?.focus();
    },
    [pageTitle]
  );

  useEffect(() => {
    document.title = `Search Notes -  ${APP_NAME}`;
  }, []);

  const {
    actualSearchQueryFromURL,
    searchInput,
    onSearchInputChange,
    accessibleMessageForSearchInput,
    filteredNotes,
  } = useSearch();

  return (
    <div className="text-sm -tracking-50 leading-50 2xl:border-r 2xl:border-border-separator">
      <div className="pt-5 pb-4 2xl:p-0 bg-background-primary  md:w-full md:max-w-[43.75rem] md:mx-auto 2xl:mx-0 2xl:max-w-none">
        {isSmallerScreenSize && (
          <h1
            ref={pageTitle}
            tabIndex={"-1"}
            className="font-bold  text-2xl text-text-primary -tracking-150 focus:outline-none"
          >
            Search
          </h1>
        )}

        {isSmallerScreenSize && (
          <SearchInputBox
            actualSearchQueryFromURL={actualSearchQueryFromURL}
            searchInput={searchInput}
            onSearchInputChange={onSearchInputChange}
          />
        )}

        {isSmallerScreenSize && actualSearchQueryFromURL.length > 0 && (
          <FilterStatusMessage
            filterTexts={`"${actualSearchQueryFromURL}"`}
            lastText={"are displayed below"}
          >
            All notes matching{" "}
          </FilterStatusMessage>
        )}

        {/* Accessible message for screen reader */}
        <div className="sr-only" aria-live="polite" role="status">
          <span>{accessibleMessageForSearchInput()}</span>
        </div>
      </div>

      <ListOfNotes
        notes={filteredNotes}
        type={"search"}
        parentPath={"/search"}
      />
    </div>
  );
}

export default SearchPage;
