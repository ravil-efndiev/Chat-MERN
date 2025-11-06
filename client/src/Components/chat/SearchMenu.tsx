import { Box, Button, TextField } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { APIResponseUser, ChatUser } from "../../types/user";
import { setUserPfps } from "./Sidebar";
import UserDisplay from "./UserDisplay";
import { useMobileWindowInfo, useSelectedUserId } from "../../utils/contexts";
import { api } from "../../main";
import cancelCross from "../../assets/cancel-cross.svg";

interface Props {
  onClose: () => void;
}

function SearchMenu({ onClose }: Props) {
  const [foundUsers, setFoundUsers] = useState<ChatUser[]>([]);
  const searchMenuRef = useRef<HTMLDivElement>(null);
  const { setSelectedUserId } = useSelectedUserId();
  const { isWindowMobile, setConversationVisible } = useMobileWindowInfo();

  const { handleInputChange } = useDebounce((value) => {
    if (!value) {
      setFoundUsers([]);
      return;
    }

    api
      .get(`/api/users/get-by-username/${value}`)
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
    setSelectedUserId(user.id);
    if (isWindowMobile) {
      setConversationVisible(true);
    }
    onClose();
  };

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
      <Box sx={{ display: "flex" }}>
        <TextField
          variant="standard"
          placeholder="Search for a user"
          color="secondary"
          sx={{ width: "100%" }}
          multiline
          maxRows={3}
          onChange={handleInputChange}
        />
        <Button
          color="secondary"
          onClick={onClose}
          sx={{
            my: "auto",
            borderRadius: "50%",
            minWidth: 55,
            width: 55, 
            height: 55,
            ml: "10px"
          }}
        >
          <img src={cancelCross} alt="" width={35} />
        </Button>
      </Box>
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
            key={user.id}
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
