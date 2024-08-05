import { useEffect, useState } from "react";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Button, Grid } from "@mui/material";
import * as NotesApi from "./network/notes_api";
import AddorUpdateNoteDialog from "./components/AddorUpdateNoteModal";

import AddIcon from "@mui/icons-material/Add";
import AuthModal from "./components/AuthModal";
import NavBar from "./components/NavBar";
import { User } from "./models/user";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [noteToEdit, setNotetoEdit] = useState<NoteModel | null>(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [signUpBool, setSignUpBool] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const getNewNote = (newNote: NoteModel) => {
    if (noteToEdit) {
      setNotes(
        notes.map((existingNote) =>
          existingNote._id === newNote._id ? newNote : existingNote
        )
      );
      setNotetoEdit(null);
    } else {
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }
  };

  const getDeletedNote = (id: string) => {
    setNotes(notes.filter((note) => note._id !== id));
  };
  const handleNoteClick = (note: NoteModel) => {
    setAddNoteOpen(true);
    setNotetoEdit(note);
  };

  useEffect(() => {
    const checkForSession = async () => {
      try {
        const response = await fetch("/api/users/", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("User not authenticated");
        }
        const user = await response.json();
        setUserDetails(user);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkForSession();
    const loadNotes = async () => {
      try {
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
      }
    };
    loadNotes();
  }, [isLoggedIn]);

  return (
    <Grid
      container
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      style={{ padding: 20 }}
      gap={2}
    >
      <NavBar
        setOpenAuthModal={setOpenAuthModal}
        setSignUpBool={setSignUpBool}
        isLoggedIn={isLoggedIn}
        userDetails={userDetails}
        setIsLoggedIn={setIsLoggedIn}
      ></NavBar>
      <AuthModal
        open={openAuthModal}
        setOpen={setOpenAuthModal}
        signUpBool={signUpBool}
        setIsLoggedIn={setIsLoggedIn}
        setUserDetails={setUserDetails}
      ></AuthModal>

      {!isLoggedIn && <>Please login to add or view notes</>}

      {isLoggedIn && (
        <>
          <Button variant="contained" onClick={() => setAddNoteOpen(true)}>
            <AddIcon />
            Add Note
          </Button>

          <Grid container direction={"row"} gap={2}>
            {notes.length !== 0
              ? notes.map((note) => (
                  <Grid
                    item
                    key={note._id}
                    onClick={() => handleNoteClick(note)}
                  >
                    <Note note={note} getDeletedNote={getDeletedNote} />
                  </Grid>
                ))
              : null}

            <AddorUpdateNoteDialog
              noteToEdit={noteToEdit}
              open={addNoteOpen}
              setOpen={setAddNoteOpen}
              getNewNote={getNewNote}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default App;
