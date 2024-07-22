import React, { useEffect, useState } from "react";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Grid } from "@mui/material";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/notes", { method: "GET" });
        const notes = await response.json();
        setNotes(notes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Grid container direction={"row"} style={{ padding: 20 }} gap={2}>
      {notes.map((note) => (
        <Grid item key={note._id}>
          <Note note={note} />
        </Grid>
      ))}
    </Grid>
  );
}

export default App;
