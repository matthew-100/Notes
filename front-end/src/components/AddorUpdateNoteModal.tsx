import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { addNote, updateNote } from "../network/notes_api";
import { Note as NoteModel } from "../models/note";

interface AddorUpdateNotePropsType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getNewNote: (note: NoteModel) => void;
  noteToEdit?: NoteModel | null;
}

const AddorUpdateNoteDialog = ({
  open,
  setOpen,
  getNewNote,
  noteToEdit,
}: AddorUpdateNotePropsType) => {
  const [NoteData, setNoteData] = useState({
    title: "",
    text: "",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNoteData((prevNoteData) => ({
      ...prevNoteData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setNoteData({
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    });
  };

  const handleSubmit = async () => {
    let noteResponse: NoteModel;
    try {
      if (noteToEdit) {
        noteResponse = await updateNote(noteToEdit._id, NoteData);
      } else {
        noteResponse = await addNote(NoteData);
      }

      getNewNote(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
    setOpen(false);
    setNoteData({
      title: "",
      text: "",
    });
  };

  useEffect(() => {
    if (noteToEdit) {
      setNoteData({
        title: noteToEdit.title || "",
        text: noteToEdit.text || "",
      });
    } else {
      setNoteData({
        title: "",
        text: "",
      });
    }
  }, [noteToEdit]);

  return (
    <Dialog open={open}>
      <DialogTitle>Add a New Note</DialogTitle>
      <DialogContent>
        <TextField
          onChange={handleChange}
          autoFocus
          required
          margin="dense"
          value={NoteData.title}
          id="title"
          name="title"
          label="Title"
          fullWidth
          variant="standard"
        />
        <TextField
          onChange={handleChange}
          autoFocus
          margin="dense"
          value={NoteData.text}
          id="text"
          name="text"
          label="Description"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddorUpdateNoteDialog;
