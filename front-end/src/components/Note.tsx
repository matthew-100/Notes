import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Note as NoteModel } from "../models/note";
import { makeStyles } from "@mui/styles";

interface NoteProps {
  note: NoteModel;
}

const useStyles = makeStyles({
    noteCard: {
      backgroundColor: 'cornsilk',
      minWidth: '500px',
      maxWidth: '500px',
      maxHeight: '70px',
      overflow: 'auto',
    },
  });

const Note = ({ note }: NoteProps) => {
  const { title, text } = note;
  const classes = useStyles();

  

  return (
    <Grid container direction={"column"} justifyContent={"center"} alignItems={'center'} >
      <Grid item>
        <Card className={classes.noteCard}>
          <CardContent>
            <Typography variant="h5">{note.title}</Typography>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              {note.text}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Note;
