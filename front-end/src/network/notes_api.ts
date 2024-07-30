import { Note } from "../models/note";

export interface NoteInput {
  title: string;
  text?: string;
}

const fetchData = async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
};

export const fetchNotes = async () => {
  const response = await fetchData("/api/notes", { method: "GET" });
  return response.json();
};

export const addNote = async (note: NoteInput) => {
  const response = await fetchData("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
};

export const deleteNote = async (id: string) => {
  await fetchData(`/api/notes/${id}`, { method: "DELETE" });
};

export const updateNote = async (
  id: string,
  note: NoteInput
): Promise<Note> => {
  const response = await fetchData(`/api/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
};
