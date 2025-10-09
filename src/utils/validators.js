//Validators
export function validateRequired(value) {
  return value === "" ? "A note title shouldn't be empty" : null;
}

export function validateUniqueTitle(
  value,
  notes,
  currentNoteOriginalTitle = null
) {
  const trimmedValue = value.trim();

  const isDuplicate = notes.some(
    (note) =>
      note.title === trimmedValue && note.title !== currentNoteOriginalTitle
  );

  return isDuplicate
    ? "A note with this title already exists. Please choose a different title."
    : null;
}

//A function which applies a set of validators on an input value
export function validateField(validators, value) {
  for (const validator of validators) {
    const error = validator(value);

    if (error) return error;
  }

  return null;
}

export const formatDate = function (date) {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const normalizeTags = function (rawTags) {
  if (rawTags.length === 0) return [];

  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")
    .map((tag) => {
      if (tag.length === 0) return "";

      return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
    });
};
