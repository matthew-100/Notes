import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { login, signUp } from "../network/notes_api";

interface AuthModalProps {
  open: boolean;
  setOpen: Function;
  signUpBool: boolean;
}

const AuthModal = ({ open, setOpen, signUpBool }: AuthModalProps) => {
  const nullUser = {
    username: "",
    email: "",
    password: "",
  };

  const [userData, setUserData] = useState(nullUser);

  const handleClose = () => {
    setUserData(nullUser);
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (signUpBool: boolean) => {
    let authResponse;
    if (signUpBool) {
      authResponse = await signUp(userData);
    } else {
      authResponse = await login(userData);
    }
    setOpen(false);
  };
  return (
    <Dialog open={open}>
      <DialogTitle>{signUpBool ? "Sign Up" : "Login"}</DialogTitle>
      <DialogContent>
        <TextField
          onChange={handleChange}
          autoFocus
          required
          margin="dense"
          value={userData.username}
          id="username"
          name="username"
          label="Username"
          fullWidth
          variant="standard"
        />
        {signUpBool && (
          <TextField
            onChange={handleChange}
            autoFocus
            required
            margin="dense"
            value={userData.email}
            id="email"
            name="email"
            label="Email"
            fullWidth
            variant="standard"
          />
        )}

        <TextField
          onChange={handleChange}
          autoFocus
          required
          margin="dense"
          value={userData.password}
          id="password"
          name="password"
          label="Password"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => handleSubmit(signUpBool)}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
