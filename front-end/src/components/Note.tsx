import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Note as NoteModel } from "../models/note";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteNote } from "../network/notes_api";

interface NoteProps {
  note: NoteModel;
  getDeletedNote: (id: string) => void;
}

const useStyles = makeStyles({
  noteCard: {
    backgroundColor: "cornsilk",
    minWidth: "500px",
    maxWidth: "500px",
    maxHeight: "70px",
    overflow: "auto",
  },
});

const Note = ({ note, getDeletedNote }: NoteProps) => {
  const { title, text } = note;
  const classes = useStyles();

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      getDeletedNote(id);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Grid item>
        <Card className={classes.noteCard}>
          <CardContent>
            <Grid container justifyContent={"space-between"}>
              <Typography variant="h5">{title}</Typography>
              <IconButton
                onClick={(e) => {
                  handleDeleteNote(note._id);
                  e.stopPropagation();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Typography variant="body1" color="text.secondary">
              {text}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Note;
