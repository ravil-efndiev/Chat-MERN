import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../db/models/userModel";
import { clearToken } from "../utils/token";
import { sendUserData, sendUserDataAndToken, uploadProfilePic } from "../utils/functions"
import { UserModelType } from "../db/models/userModel";
import checkAuthStatus from "../middleware/checkAuthStatus";
import {
  passwordValid,
  usernameValid,
  validateAndTrimFullname,
} from "../utils/validation";
import multer from "multer";
import { bucket } from "../db/connect";
import { Types } from "mongoose";
import fs from "fs";

interface LoginRequestType {
  username: string;
  password: string;
}

const router = express.Router();
const upload = multer({ dest: "uploads/" });

async function createUser(
  username: string,
  fullName: string,
  password: string,
  profilePicture?: Types.ObjectId
) {
  const user = new UserModel({
    fullName: fullName,
    username: username,
    password: password,
    profilePicture: profilePicture,
  });

  await user.save();
  return user;
}

router.post(
  "/register",
  upload.single("profilePicture"),
  async (req: Request<{}, {}, UserModelType>, res: Response) => {
    try {
      const { fullName, username, password } = req.body;
      const pfp = req.file;

      if (!usernameValid(username, res)) return;
      if (!passwordValid(password, res)) return;

      const validFullName = validateAndTrimFullname(fullName, res);
      if (!validFullName) return;

      const userExists = await UserModel.findOne({ username: username });
      if (userExists) {
        res.status(403).json({ error: `User with this username already exists` });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      if (!pfp) {
        const user = await createUser(username, validFullName, passwordHash);
        sendUserDataAndToken(user, res);
        return;
      }

      uploadProfilePic(pfp, async (fileID) => {
        const user = await createUser(username, validFullName, passwordHash, fileID);
        sendUserDataAndToken(user, res);
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequestType>, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username: username });

      if (!user) {
        res.status(404).json({ error: `Invalid username` });
        return;
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        res.status(400).json({ error: `Invalid password` });
        return;
      }

      sendUserDataAndToken(user, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/logout", (req: Request, res: Response) => {
  try {
    clearToken(res);
    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/status", checkAuthStatus, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userID);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    sendUserData(user, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
