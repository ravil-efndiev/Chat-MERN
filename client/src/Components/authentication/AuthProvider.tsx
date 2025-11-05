import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUser } from "../../types/user";
import { CircularProgress } from "@mui/material";
import { api } from "../../main";

interface AuthContextType {
  currentUser: AuthUser;
  setCurrentUser: Dispatch<SetStateAction<AuthUser>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/auth/status")
      .then((res) => {
        setCurrentUser(res.data.user)
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

      const interceptor = api.interceptors.response.use(
        (res) => res,
        (error) => {
          if (error.response?.status === 401) {
            setCurrentUser(null);
          }
          return Promise.reject(error);
        }
      );
    
      return () => api.interceptors.response.eject(interceptor);
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
