import { useEffect, useState } from "react";
import { APIResponseUser } from "../../types/user";
import axios from "axios";
import { Box, Button, Paper, Typography } from "@mui/material";
import drawerSwitchImg from "../../assets/drawer-switch.svg"

interface Props {
  onUserSelected: (id: string) => void;
  onDrawerOpen: () => void;
}

function Sidebar({ onUserSelected, onDrawerOpen }: Props) {
  const [users, setUsers] = useState<APIResponseUser[]>([]);
  const [activeUserID, setActiveUserID] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/get-chats", {
        withCredentials: true,
      })
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUserClick = (id: string) => {
    onUserSelected(id);
    setActiveUserID(id);
  };

  return (
    <Paper elevation={5} className="sidebar">
      <div className="sidebar-top">
        <Button
          variant="contained"
          onClick={() => onDrawerOpen()}
          sx={{minWidth: 0, p: 1, m: 1}}
        >
          <img src={drawerSwitchImg} width={30} alt="drawer switch" />
        </Button>
      </div>
      {users.map((user) => (
        <div
          className={
            activeUserID === user.id
              ? "sidebar-user user-active"
              : "sidebar-user"
          }
          key={user.id}
          onClick={() => handleUserClick(user.id)}
        >
          <img
            src="https://avatar.iran.liara.run/public/boy"
            width={50}
            alt=""
          />
          <Box sx={{ ml: 2 }}>
            <Typography>{user.fullName}</Typography>
            <Typography sx={{ fontWeight: 100, fontSize: 16, color: "#ccc" }}>
              some text
            </Typography>
          </Box>
        </div>
      ))}
    </Paper>
  );
}

export default Sidebar;
