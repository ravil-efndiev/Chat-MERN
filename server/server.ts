import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";
import messageRouter from "./routes/messageRoutes";
import usersRouter from "./routes/userRoutes";
import connectDB from "./db/connect";
import cors from "cors";
import cookieParser from "cookie-parser";
import createSocket from "./socket";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


export const { io, server } = createSocket(app);
export const userSocketIDs = new Map<string, string>();

io.on("connection", (socket) => {
  const userID = socket.handshake.query.userID as string | undefined;

  if (userID) {
    userSocketIDs.set(userID, socket.id);
  }
  
  io.on("disconnect", () => {
    if (userID) {
      userSocketIDs.delete(userID);
    }
  });
});

app.use(
  cors({
    origin: process.env.DEV_MODE ? "http://localhost:5173" : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", usersRouter);

const dirname = path.resolve();
app.use(express.static(path.join(dirname, "client", "dist"))); 

app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "client", "dist", "index.html"));
});

server.listen(port, () => {
  connectDB();
  console.log(`app is running on ${port}`);
});
