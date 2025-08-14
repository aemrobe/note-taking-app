import { useTag } from "../Context/TagContext";
import TagIcon from "./TagIcon";
import { useToast } from "../Context/ToastContext";

function FilterTags({ children, paddingTop = "" }) {
  const { handleTagClick, selectedTags } = useTag();
  const { handleShowToastMessage } = useToast();
  const tag = children.trim();

  return (
    <li>
      <button
        onClick={() => {
          handleShowToastMessage({
            text: `Tag ${tag} ${
              selectedTags.includes(tag) ? "removed" : "added"
            } successfully!`,
          });
          handleTagClick(tag);
        }}
        className={`w-full flex items-center py-3.5 ${paddingTop} gap-2 focus-visible:outline-none focus-visible:ring-2 ring-focus-ring ring-offset-2`}
      >
        <TagIcon width={"w-5"} />
        {children}
      </button>
    </li>
  );
}

export default FilterTags;
