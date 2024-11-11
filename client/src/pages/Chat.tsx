import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthProvider";
import axios from "axios";

function Chat() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    axios
      .post(
        "http://localhost:3000/api/auth/logout", {},
        { withCredentials: true }
      )
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Typography>{currentUser?.username}</Typography>
      <Typography>{currentUser?.fullName}</Typography>
      <Button color="secondary" variant="contained" onClick={handleLogoutClick}>
        Log Out
      </Button>
    </Container>
  );
}

export default Chat;
