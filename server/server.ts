import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/authRoutes"
import messageRouter from "./routes/messageRoutes"
import usersRouter from "./routes/userRoutes"
import connectDB from "./db/connect";
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

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
  console.log(`app is running on ${port}`)
});
