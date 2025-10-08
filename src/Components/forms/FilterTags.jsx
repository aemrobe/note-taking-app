import { useTag } from "../../Context/TagContext";
import TagIcon from "../icons/TagIcon";
import { useToast } from "../../Context/ToastContext";
import { useNotes } from "../../Context/NoteContext";
import ArrowRightIcon from "../icons/ArrowRightIcon";

function FilterTags({ children, paddingTop = "", paddingBottom = "" }) {
  const { onTagClick, selectedTags } = useTag();
  const { onShowToastMessage } = useToast();
  const { isSmallerScreenSize } = useNotes();
  const tag = children.trim();

  const isTheTagAdded = selectedTags.includes(tag);

  return (
    <li>
      <button
        onClick={() => {
          onShowToastMessage({
            text: `Tag ${tag} ${
              selectedTags.includes(tag) ? "removed" : "added"
            } successfully!`,
          });
          onTagClick(tag);
        }}
        className={`w-full flex items-center py-3.5 xl:py-2.5 xl:px-3 ${paddingTop} ${paddingBottom} gap-2 focusable-ring ${
          !isSmallerScreenSize && isTheTagAdded
            ? "text-text-primary bg-desktop-navigation-link-background-active rounded-lg"
            : ""
        }`}
      >
        <span
          className={`${
            !isSmallerScreenSize && isTheTagAdded ? "text-blue500" : ""
          }`}
        >
          <TagIcon width={"w-5"} />
        </span>

        {children}

        {!isSmallerScreenSize && isTheTagAdded && (
          <span className="ml-auto text-text-primary">
            <ArrowRightIcon width={"w-6"} />
          </span>
        )}
      </button>
    </li>
  );
}

export default FilterTags;
