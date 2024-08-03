import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { User } from "../models/user";
import { logout } from "../network/notes_api";

export interface NavBarProps {
  setOpenAuthModal: Function;
  setSignUpBool: Function;
  isLoggedIn: boolean;
  setIsLoggedIn: Function;
  userDetails?: User | null;
}

const NavBar = ({
  setOpenAuthModal,
  setSignUpBool,
  isLoggedIn,
  setIsLoggedIn,
  userDetails,
}: NavBarProps) => {
  const handleLoginClick = () => {
    setOpenAuthModal(true);
    setSignUpBool(false);
  };

  const handleSignUpClick = () => {
    setOpenAuthModal(true);
    setSignUpBool(true);
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Failed to logout");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Your Notes
            </Typography>
          </Grid>
          {isLoggedIn ? (
            <>
              <Grid item>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {userDetails?.username}
                </Typography>
              </Grid>
              <Button onClick={handleLogoutClick} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleLoginClick} color="inherit">
                Login
              </Button>
              <Button onClick={handleSignUpClick} color="inherit">
                Sign Up
              </Button>
            </>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
