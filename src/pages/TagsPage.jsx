import { useEffect, useRef } from "react";
import FilterTags from "../Components/FilterTags";
import { useTag } from "../Context/TagContext";
import ListOfNotes from "../Components/ListOfNotes";
import GoBackBtn from "../Components/GoBackBtn";
import { useSearchParams } from "react-router";
import FilterStatusMessage from "../Components/FilterStatusMessage";
import { useSettings } from "../Context/SettingsContext";
import { APP_NAME, localStorageTagKey } from "../config/constants";

function TagsPage() {
  const { filteredNotes, uiMode, setUiMode, selectedTags, isOnTagPage } =
    useTag();

  const { activeColorTheme } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();

  const hasSynced = useRef(false);
  const tagLists = selectedTags.join(", ");
  const handleGoBackBtn = function () {
    setUiMode("tagSelection");
  };

  useEffect(() => {
    document.title = `Tags - ${APP_NAME}`;
  }, []);

  // // This effect helps to get the savedtags from localstorage and sync them with Browser url on the first load
  useEffect(
    function () {
      if (!isOnTagPage || hasSynced.current) return;

      const tags = localStorage.getItem(localStorageTagKey);

      const savedTags = tags ? JSON.parse(tags) : [];

      if (selectedTags.length === 0 && savedTags.length > 0) {
        const newParams = new URLSearchParams();

        savedTags.forEach((tag) => newParams.append("tag", tag));

        setSearchParams(newParams);
      }

      hasSynced.current = true;
    },
    [selectedTags, isOnTagPage, setSearchParams]
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
    <div className="text-toolbar-action-text pt-6 ">
      {/* Go Back Button */}
      {uiMode === "filteredNotes" && (
        <GoBackBtn onClick={handleGoBackBtn}>
          {activeColorTheme === "dark" ? "All Tags" : "Go Back"}
        </GoBackBtn>
      )}

      <h2
        className={`font-bold ${
          uiMode === "tagSelection" ? "text-text-primary" : ""
        } -tracking-150 text-2xl mb-4 ${uiMode === "filteredNotes" && "mt-4"}`}
      >
        {uiMode === "tagSelection" ? (
          "Tags"
        ) : (
          <>
            <span className="text-filter-status-text">Notes Tagged: </span>
            <span className="text-text-primary">{tagLists}</span>
          </>
        )}
      </h2>

      {uiMode === "filteredNotes" && (
        <FilterStatusMessage
          filterTexts={`"${tagLists}"`}
          lastText={"tag are shown here."}
          marginBottom="mb-4"
        >
          All notes with{" "}
        </FilterStatusMessage>
      )}

      <ul className="divide-y divide-border-separator text-filter-tag-text">
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
