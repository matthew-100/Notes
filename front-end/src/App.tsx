import { useEffect, useState } from "react";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Button, Grid } from "@mui/material";
import * as NotesApi from "./network/notes_api";
import AddorUpdateNoteDialog from "./components/AddorUpdateNoteModal";

import AddIcon from "@mui/icons-material/Add";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [noteToEdit, setNotetoEdit] = useState<NoteModel | null>(null);
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
    const loadNotes = async () => {
      try {
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
      }
    };
    loadNotes();
  }, []);

  return (
    <Grid
      container
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      style={{ padding: 20 }}
      gap={2}
    >
      <Button variant="contained" onClick={() => setAddNoteOpen(true)}>
        <AddIcon />
        Add Note
      </Button>
      <Grid container direction={"row"} gap={2}>
        {notes.map((note) => (
          <Grid item key={note._id} onClick={() => handleNoteClick(note)}>
            <Note note={note} getDeletedNote={getDeletedNote} />
          </Grid>
        ))}

        <AddorUpdateNoteDialog
          noteToEdit={noteToEdit}
          open={addNoteOpen}
          setOpen={setAddNoteOpen}
          getNewNote={getNewNote}
        />
      </Grid>
    </Grid>
  );
}

export default App;
