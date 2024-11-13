import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./pages/Chat";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AuthProvider from "./Components/authentication/AuthProvider";
import ProtectedRoute from "./Components/authentication/ProtectedRoute";
import { createTheme, ThemeProvider } from "@mui/material";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const theme = createTheme({
  palette: {
    mode:'dark'
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
