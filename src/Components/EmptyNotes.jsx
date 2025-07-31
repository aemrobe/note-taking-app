function EmptyNotes({ children, link = "" }) {
  return (
    <p className="bg-empty-state-background border border-empty-state-border p-2 text-empty-state-text rounded-lg">
      {children}

      {link && (
        <span className="underline underline-offset-2 decoration-1 decoration-neutral950">
          {link}
        </span>
      )}
    </p>
  );
}

export default EmptyNotes;
