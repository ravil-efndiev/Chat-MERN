import {
  PropsWithChildren,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./authentication/AuthProvider";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

function SocketProvider({ children }: PropsWithChildren) {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!currentUser) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    setSocket(
      io("http://localhost:3000", {
        query: {
          userID: currentUser.id,
        },
      })
    );

    return () => {socket?.close()};
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("Context should be only used inside it's provider");
  }

  return context;
}

export default SocketProvider;
