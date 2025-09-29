import { NavLink } from "react-router";

function EmptyNotes({ children, link = "" }) {
  return (
    <p
      aria-live="polite"
      role="status"
      className="bg-empty-state-background border border-empty-state-border p-2 text-empty-state-text rounded-lg"
    >
      {children}{" "}
      {link && (
        <NavLink
          to={"/create-new-note"}
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
