import { createPortal } from "react-dom";

function Portal({ children }) {
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) return null;

  return createPortal(children, modalRoot);
}

export default Portal;
