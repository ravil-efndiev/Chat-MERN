import { Box, TextField } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { APIResponseUser, ChatUser } from "../../types/user";
import { setUserPfps } from "./Sidebar";
import UserDisplay from "./UserDisplay";

interface Props {
  onClose: () => void;
  onUserSelect: (user: ChatUser) => void;
}

function SearchMenu({ onClose, onUserSelect }: Props) {
  const [foundUsers, setFoundUsers] = useState<ChatUser[]>([]);
  const searchMenuRef = useRef<HTMLDivElement>(null);

  const { handleInputChange } = useDebounce((value) => {
    if (!value) {
      setFoundUsers([]);
      return;
    }

    axios
      .get(`http://localhost:3000/api/users/get-by-username/${value}`, {
        withCredentials: true,
      })
      .then(async (res) => {
        const users: APIResponseUser[] = res.data.users;
        const usersWithPfps = setUserPfps(users);
        setFoundUsers(await Promise.all(usersWithPfps));
      })
      .catch(() => {
        setFoundUsers([]);
      });
  });

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        searchMenuRef.current &&
        !searchMenuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  
  const handleUserClick = (user: ChatUser) => {
    onUserSelect(user);
    onClose();
  }

  return (
    <Box
      sx={{
        position: "absolute",
        width: "80%",
        height: "90%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "#2B2B2Bdd",
        border: "1px solid",
        borderColor: "secondary.main",
        borderRadius: 2,
        p: 3,
      }}
      ref={searchMenuRef}
    >
      <TextField
        variant="standard"
        placeholder="Search for a user"
        color="secondary"
        sx={{ width: "100%" }}
        multiline
        maxRows={3}
        onChange={handleInputChange}
      />
      <Box sx={{ overflow: "auto" }}>
        {foundUsers.map((user) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              cursor: "pointer",
              ":hover": { bgcolor: "#303030" },
            }}
            onClick={() => handleUserClick(user)}
          >
            <UserDisplay user={user} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default SearchMenu;
