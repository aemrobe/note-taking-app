import { useMemo, useState } from "react";
import ListOfNotes from "../Components/ListOfNotes";
import SearchIcon from "../Components/SearchIcon";
import { useNotes } from "../Context/NoteContext";
import { useSearch } from "../Context/SearchContext";

function SearchPage() {
  const { searchInput, setSearchInput, filteredNotes } = useSearch();

  return (
    <div className="pt-5 text-sm -tracking-50 leading-50  ">
      <div className="pb-4 bg-white sticky top-0">
        <h2 className="font-bold  text-2xl -tracking-150">Search</h2>

        <span
          className={`
            ${searchInput.length > 0 && "mb-4"}
          flex space-x-2 py-3 px-4 border-2 border-neutral300 bg-neutral50 rounded-lg mt-4`}
        >
          <label htmlFor="search" className="text-neutral500">
            <SearchIcon width={"w-5"} />
          </label>

          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-auto focus:outline-none text-sm -tracking-50 leading-50 text-neutral950"
            id="search"
            type="search"
            placeholder="Search by title, content, or tags..."
          />
        </span>

        {searchInput.length > 0 && (
          <p className="text-neutral700">
            All notes matching &ldquo;{searchInput}&rdquo; are displayed below.
          </p>
        )}
      </div>

      <ListOfNotes notes={filteredNotes} type={"search"} />
    </div>
  );
}

export default SearchPage;
