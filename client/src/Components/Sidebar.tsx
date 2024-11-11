import { useEffect, useState } from "react";
import { APIResponseUser } from "../types/user";
import axios from "axios";
import { Box, Paper, Typography } from "@mui/material";

interface Props {
  userClicked: (id: string) => void;
}

function Sidebar({ userClicked }: Props) {
  const [users, setUsers] = useState<APIResponseUser[]>([]);

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

  return (
    <Paper elevation={5} className="sidebar">
      {users.map((user) => (
        <div
          className="sidebar-user"
          key={user.id}
          onClick={() => userClicked(user.id)}
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
