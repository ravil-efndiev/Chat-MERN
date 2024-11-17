import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";
import messageRouter from "./routes/messageRoutes";
import usersRouter from "./routes/userRoutes";
import connectDB from "./db/connect";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const io = new Server(http.createServer(app), {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  io.on("disconnect", () => {
    console.log("disconnected");
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", usersRouter);

app.listen(port, () => {
  connectDB();
  console.log(`app is running on ${port}`);
});
