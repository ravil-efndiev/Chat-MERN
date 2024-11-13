import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: PropsWithChildren) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);

  return currentUser ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
