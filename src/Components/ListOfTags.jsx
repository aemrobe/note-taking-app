import { useNotes } from "../Context/NoteContext";
import FilterTags from "./FilterTags";

function ListOfTags() {
  const { isSmallerScreenSize } = useNotes();

  return (
    <>
      <FilterTags paddingTop={isSmallerScreenSize ? "pt-2.5" : ""}>
        Cooking
      </FilterTags>
      <FilterTags>Dev</FilterTags>
      <FilterTags>Fitness</FilterTags>
      <FilterTags>Health</FilterTags>
      <FilterTags>Personal</FilterTags>
      <FilterTags>React</FilterTags>
      <FilterTags>Recipes</FilterTags>
      <FilterTags>Shopping</FilterTags>
      <FilterTags>Travel</FilterTags>
      <FilterTags paddingBottom={isSmallerScreenSize ? "pb-2.5" : ""}>
        TypeScript
      </FilterTags>
    </>
  );
}

export default ListOfTags;
