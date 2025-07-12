import { useEffect, useRef } from "react";
import FilterTags from "../Components/FilterTags";
import { useTag } from "../Context/TagContext";
import ListOfNotes from "../Components/ListOfNotes";
import GoBackBtn from "../Components/GoBackBtn";
import { useSearchParams } from "react-router";

function TagsPage() {
  const {
    filteredNotes,
    uiMode,
    setUiMode,
    displayedTags,
    selectedTags,
    isOnTagPage,
  } = useTag();

  const [searchParams, setSearchParams] = useSearchParams();

  const hasSynced = useRef(false);
  const tagLists = selectedTags.join(", ");
  const handleGoBackBtn = function () {
    setUiMode("tagSelection");
  };

  // // This effect helps to get the savedtags from localstorage and sync them with Browser url on the first load
  useEffect(
    function () {
      if (!isOnTagPage || hasSynced.current) return;

      const tags = displayedTags;

      const savedTags = tags ? tags : [];

      if (selectedTags.length === 0 && savedTags.length > 0) {
        const newParams = new URLSearchParams();

        savedTags.forEach((tag) => newParams.append("tag", tag));

        setSearchParams(newParams);
      }

      hasSynced.current = true;
    },
    [selectedTags, displayedTags, isOnTagPage, setSearchParams, setUiMode]
  );

  useEffect(
    function () {
      if (!isOnTagPage) return;

      setUiMode(selectedTags.length === 0 ? "tagSelection" : "filteredNotes");

      return () => {
        setUiMode("tagSelection");
      };
    },
    [selectedTags, setUiMode, isOnTagPage]
  );

  return (
    <div className="text-neutral600 pt-6 ">
      {/* Go Back Button */}
      {uiMode === "filteredNotes" && <GoBackBtn onClick={handleGoBackBtn} />}

      <h2
        className={`font-bold ${
          uiMode === "tagSelection" ? "text-neutral950" : ""
        } -tracking-150 text-2xl mb-4 ${uiMode === "filteredNotes" && "mt-4"}`}
      >
        {uiMode === "tagSelection" ? (
          "Tags"
        ) : (
          <>
            <span>Notes Tagged: </span>
            <span className="text-neutral950">{tagLists}</span>
          </>
        )}
      </h2>

      {uiMode === "filteredNotes" && (
        <p className="text-sm leading-50 text-neutral700 -tracking-50 mb-4">
          All notes with &quot;{tagLists}&quot; tag are shown here.
        </p>
      )}

      <ul className="divide-y divide-neutral200 text-neutral700">
        {uiMode === "filteredNotes" ? (
          <ListOfNotes notes={filteredNotes} />
        ) : (
          <>
            <FilterTags paddingTop="pt-2.5"> Cooking</FilterTags>
            <FilterTags>Dev</FilterTags>
            <FilterTags>Fitness</FilterTags>
            <FilterTags>Health</FilterTags>
            <FilterTags>Personal</FilterTags>
            <FilterTags>React</FilterTags>
            <FilterTags>Recipes</FilterTags>
            <FilterTags>Shopping</FilterTags>
            <FilterTags>Travel</FilterTags>
            <FilterTags>TypeScript</FilterTags>
          </>
        )}
      </ul>
    </div>
  );
}

export default TagsPage;
