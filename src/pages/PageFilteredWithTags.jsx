import { useParams } from "react-router";

function PageFilteredWithTags() {
  const { selectedTags } = useParams();
  return <div>{selectedTags}</div>;
}

export default PageFilteredWithTags;
