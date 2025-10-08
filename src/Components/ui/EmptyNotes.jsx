import { NavLink, useLocation } from "react-router";

function EmptyNotes({ children, link = "" }) {
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];

  const createNewNoteLink = `${
    basePath === "archived-notes" ? `/${basePath}/new` : "/all-notes/new"
  }`;

  return (
    <p
      aria-live="polite"
      role="status"
      className="bg-empty-state-background border border-empty-state-border p-2 text-empty-state-text rounded-lg"
    >
      {children}{" "}
      {link && (
        <NavLink
          to={createNewNoteLink}
          className="focusable-ring underline underline-offset-2 decoration-1 decoration-toast-link-underline"
        >
          {link}
        </NavLink>
      )}
    </p>
  );
}
// S
export default EmptyNotes;
