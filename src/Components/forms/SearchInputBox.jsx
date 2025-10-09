import SearchIcon from "../icons/SearchIcon";

function SearchInputBox({
  actualSearchQueryFromURL,
  searchInput,
  onSearchInputChange,
}) {
  return (
    <span
      className={`${
        actualSearchQueryFromURL.length > 0 ? "mb-4 xl:mb-0" : ""
      } flex space-x-2 p-4 xl:py-3 2x:px-4 border border-search-input-border bg-search-input-background xl:bg-transparent rounded-lg mt-4 xl:mt-0 xl:w-[18.75rem]`}
    >
      <label htmlFor="search" className="text-search-icon">
        <SearchIcon width={"w-5"} />
        <span className="sr-only"> Search notes input</span>
      </label>

      <input
        value={searchInput}
        onChange={onSearchInputChange}
        className="flex-auto focus:outline-none placeholder:text-search-input-placeholder text-sm -tracking-50 leading-50 text-search-input-text"
        id="search"
        type="text"
        placeholder="Search by title, content, or tags..."
      />
    </span>
  );
}

export default SearchInputBox;
