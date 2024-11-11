import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types/user";
import axios from "axios";
import { CircularProgress } from "@mui/material";

interface AuthContextType {
  currentUser: User;
  setCurrentUser: Dispatch<SetStateAction<User>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/status", { withCredentials: true })
      .then((res) => {
        setCurrentUser({
          id: res.data.id,
          username: res.data.username,
          fullName: res.data.fullName,
          profilePicture: res.data.profilePicture,
        })
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Context should be only used inside it;s provider");
  }

  return context;
}

export default AuthProvider;
