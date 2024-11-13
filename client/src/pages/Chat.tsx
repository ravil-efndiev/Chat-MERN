import { Box } from "@mui/material";
import Sidebar from "../Components/chat/Sidebar";
import { useEffect, useState } from "react";
import Conversation from "../Components/chat/Conversation";
import { useAuth } from "../Components/authentication/AuthProvider";
import axios from "axios";

function Chat() {
  const [activeUserID, setActiveUserID] = useState("");
  const { currentUser } = useAuth();
  const [pfpUrl, setPfpUrl] = useState("");

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/api/users/profile-picture/${currentUser?.profilePicture}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      )
      .then((res) => {
        setPfpUrl(URL.createObjectURL(res.data));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar onUserSelected={(id) => setActiveUserID(id)} />
        <Conversation with={activeUserID} />
      </Box>
      <img src={pfpUrl} alt="" />
    </>
  );
}

export default Chat;
