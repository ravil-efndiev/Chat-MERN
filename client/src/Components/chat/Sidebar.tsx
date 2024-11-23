import { useEffect, useState } from "react";
import { APIResponseUser, ChatUser } from "../../types/user";
import axios from "axios";
import { Box, Button, Paper } from "@mui/material";
import drawerSwitchImg from "../../assets/drawer-switch.svg";
import searchImg from "../../assets/search.svg";
import { getProfilePicURL } from "../../utils/requests";
import UserDisplay from "./UserDisplay";
import { useSelectedUserID } from "../../pages/Chat";

export function setUserPfps(users: APIResponseUser[]) {
  return users.map(
    async (user): Promise<ChatUser> => ({
      ...user,
      profilePictureURL: user.profilePicture
        ? await getProfilePicURL(user.profilePicture)
        : "",
    })
  );
}

interface Props {
  onDrawerOpen: () => void;
  onSearchMenuOpen: () => void;
}

function Sidebar({
  onDrawerOpen,
  onSearchMenuOpen,
}: Props) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeUserID, setActiveUserID] = useState("");
  const { selectedUserID, setSelectedUserID } = useSelectedUserID();

  useEffect(() => {
    const getUsersAndPfps = async () => {
      try {
        const usersRes = await axios.get(
          "http://localhost:3000/api/users/get-chats",
          { withCredentials: true }
        );
        const resUsers: APIResponseUser[] = usersRes.data.users;
        const usersWithPfps = setUserPfps(resUsers);
        setUsers(await Promise.all(usersWithPfps));
      } catch (err) {
        console.error(err);
      }
    };

    getUsersAndPfps();

    if (selectedUserID) {
      setActiveUserID(selectedUserID);
    }
  }, [selectedUserID]);

  const handleUserClick = (user: ChatUser) => {
    setSelectedUserID(user.id);
    setActiveUserID(user.id);
  };

  return (
    <Paper elevation={5} className="sidebar" sx={{ overflowY: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 2, py: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => onDrawerOpen()}
          sx={{ minWidth: 0, p: 1 }}
        >
          <img src={drawerSwitchImg} width={30} alt="drawer switch" />
        </Button>
        <img
          onClick={() => onSearchMenuOpen()}
          src={searchImg}
          width={30}
          alt="searchbar switch"
          style={{cursor: "pointer"}}
        />
      </Box>
      {users.map((user) => (
        <div
          className={
            activeUserID === user.id
              ? "sidebar-user user-active"
              : "sidebar-user"
          }
          key={user.id}
          onClick={() => handleUserClick(user)}
        >
          <UserDisplay user={user} />
        </div>
      ))}
    </Paper>
  );
}

export default Sidebar;
