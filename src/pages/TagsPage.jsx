import { useCallback, useEffect, useRef, useState } from "react";
import { useTag } from "../Context/TagContext";
import ListOfNotes from "../Components/ListOfNotes";
import GoBackBtn from "../Components/ui/GoBackBtn";
import FilterStatusMessage from "../Components/ui/FilterStatusMessage";
import { useSettings } from "../Context/SettingsContext";
import { APP_NAME, TOAST_DURATION_MS } from "../config/constants";
import { useToast } from "../Context/ToastContext";
import ListOfTags from "../Components/ListOfTags";
import { useNotes } from "../Context/NoteContext";
import Heading from "../Components/ui/Heading";
import HeadingPart from "../Components/ui/HeadingPart";
import CreateNewNote from "../Components/CreateNewNote";
import { useLocation } from "react-router";

function TagsPage() {
  const location = useLocation();
  const { isSmallerScreenSize } = useNotes();
  const { filteredNotes, selectedTags, isOnTagPage, tagLists } = useTag();
  const { activeColorTheme } = useSettings();
  const { showToastMessage } = useToast();

  const [uiMode, setUiMode] = useState(() => {
    if (!isOnTagPage) return null;

    if (isSmallerScreenSize) {
      return selectedTags.length === 0 ? "tagSelection" : "filteredNotes";
    } else {
      return "filteredNotes";
    }
  });

  const h1Ref = useRef();
  const h2Ref = useRef();

  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  const handleGoBackBtn = function () {
    setUiMode("tagSelection");
  };

  const dontDisplayCreateNewNoteBtn = pathMatch("/tags/");

  //This effect helps to announce the h1 and h2 headings by considering the timing of the toast message
  useEffect(
    function () {
      const delay = showToastMessage ? TOAST_DURATION_MS + 100 : 0;

      const timer = setTimeout(() => {
        if (uiMode === "tagSelection" && h1Ref.current) {
          h1Ref.current.focus();
        } else if (uiMode === "filteredNotes" && h2Ref.current) {
          h2Ref.current.focus();
        }
      }, delay);

      return () => clearTimeout(timer);
    },
    [showToastMessage, uiMode]
  );

  useEffect(() => {
    document.title = `Tags - ${APP_NAME}`;
  }, []);

  useEffect(
    function () {
      if (!isOnTagPage) return;

      let newUiMode;

      if (isSmallerScreenSize) {
        newUiMode =
          selectedTags.length === 0 ? "tagSelection" : "filteredNotes";
      } else {
        newUiMode = "filteredNotes";
      }

      setUiMode(newUiMode);
    },
    [selectedTags, setUiMode, isOnTagPage, isSmallerScreenSize]
  );

  return (
    <div
      className="md:w-full
     md:max-w-[43.75rem] md:mx-auto xl:mx-0 xl:max-w-none focus:outline-none text-toolbar-action-text pt-6 xl:pt-0 xl:border-r xl:border-border-separator"
    >
      {/* Go Back Button */}
      {uiMode === "filteredNotes" && isSmallerScreenSize && (
        <GoBackBtn onClick={handleGoBackBtn} ariaLabel={"Go back to all tags"}>
          {activeColorTheme === "dark" ? "All Tags" : "Go Back"}
        </GoBackBtn>
      )}

      {uiMode === "tagSelection" && (
        <Heading
          level={"h1"}
          tabIndex={-1}
          ref={h1Ref}
          classname={"mb-4 text-text-primary"}
        >
          Tags
        </Heading>
      )}

      {uiMode === "filteredNotes" && (
        <Heading
          level={"h2"}
          tabIndex={-1}
          ref={h2Ref}
          aria-label={`Notes tagged with ${tagLists} tag`}
          classname={`mb-4 mt-4 ${!isSmallerScreenSize ? "sr-only" : ""} `}
        >
          <HeadingPart title={"Notes Tagged:"} text={tagLists} />
        </Heading>
      )}

      {uiMode === "filteredNotes" && isSmallerScreenSize && (
        <FilterStatusMessage
          filterTexts={`"${tagLists}"`}
          lastText={"tag are shown here."}
          marginBottom="mb-4 xl:m-0"
        >
          All notes with{" "}
        </FilterStatusMessage>
      )}

      <ul className="divide-y divide-border-separator text-filter-tag-text">
        {uiMode === "filteredNotes" ? (
          <ListOfNotes
            notes={filteredNotes}
            parentPath={"/tags"}
            uiMode={uiMode}
            type={"tags"}
          />
        ) : (
          <div aria-hidden={uiMode === "filteredNotes" ? true : false}>
            <ListOfTags />
          </div>
        )}

        {isSmallerScreenSize
          ? !dontDisplayCreateNewNoteBtn &&
            uiMode === "tagSelection" && <CreateNewNote parentPath={"/tags"} />
          : ""}
      </ul>
    </div>
  );
}

export default TagsPage;
