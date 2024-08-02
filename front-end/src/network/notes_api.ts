import { Note } from "../models/note";
import { User } from "../models/user";

export interface NoteInput {
  title: string;
  text?: string;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
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

export const getLoggedInUser: () => Promise<User> = async () => {
  const response = await fetchData("/api/users", {
    method: "GET",
  });
  return response.json();
};

export const signUp: (user: SignUpCredentials) => Promise<User> = async (
  user: SignUpCredentials
) => {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const login = async (user: User) => {
  const response = await fetchData("api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const logout = async () => {
  await fetchData("api/users/logout", {
    method: "POST",
  });
};
