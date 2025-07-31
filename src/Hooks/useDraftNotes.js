import { useCallback, useState } from "react";

function useDraftNotes(key) {
  const [draftNotesContent, setDraftNotesContent] = useState(function () {
    const savedDraft = localStorage.getItem(key);

    return savedDraft ? JSON.parse(savedDraft) : {};
  });

  const getDraftNoteContent = useCallback(
    (noteTitle) => draftNotesContent[noteTitle],
    [draftNotesContent]
  );

  const setDraftContent = useCallback(function (
    noteTitle,
    newTitle,
    tags,
    content
  ) {
    setDraftNotesContent((prev) => {
      const drafts = {
        ...prev,
        [noteTitle]: {
          newTitle,
          tags,
          content,
          lastEdited: new Date().toISOString(),
        },
      };

      return drafts;
    });
  },
  []);

  const clearDraftContent = useCallback(
    function (noteTitle) {
      setDraftNotesContent((prev) => {
        const drafts = { ...prev };

        delete drafts[noteTitle];

        return drafts;
      });
    },
    [setDraftNotesContent]
  );

  return {
    getDraftNoteContent,
    setDraftContent,
    clearDraftContent,
    draftNotesContent,
  };
}

export default useDraftNotes;
