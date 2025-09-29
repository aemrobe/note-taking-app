import { useCallback } from "react";
import { useSearchParams } from "react-router";

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
