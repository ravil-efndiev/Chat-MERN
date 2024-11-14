import { Router, Request, Response } from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { Types } from "mongoose";
import ChatModel from "../db/models/chatModel";
import UserModel, { UserModelType } from "../db/models/userModel";
import { sendUserData, uploadProfilePic } from "../utils/functions";
import { bucket } from "../db/connect";
import multer from "multer";
import { usernameValid, validateAndTrimFullname } from "../utils/validation";

const router = Router();

router.get(
  "/get-chats",
  checkAuthStatus,
  async (req: Request, res: Response) => {
    try {
      const userID = new Types.ObjectId(req.userID);

      const chats = await ChatModel.find({ participants: userID }).populate<{
        participants: (UserModelType & { _id: Types.ObjectId })[];
      }>("participants");

      const users = chats.map((chat) => {
        const other = chat.participants.find(
          (participant) => !participant._id.equals(userID)
        );

        return {
          id: other?._id.toString(),
          username: other?.username,
          fullName: other?.fullName,
          profilePicture: other?.profilePicture,
        };
      });

      res.status(200).json({ users: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get-by-username/:username",
  checkAuthStatus,
  async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const userID = new Types.ObjectId(req.userID);

      const user = await UserModel.findOne({
        username: username,
        _id: { $ne: userID },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      sendUserData(user, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get-by-id/:id",
  checkAuthStatus,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(new Types.ObjectId(id));

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      sendUserData(user, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/profile-picture/:pfpid",
  checkAuthStatus,
  async (req: Request, res: Response) => {
    try {
      const { pfpid } = req.params;

      const downloadStream = bucket.openDownloadStream(new Types.ObjectId(pfpid));
      downloadStream.on("error", () => {
        res.status(404).json({ error: "Profile picture not found" });
      });
      downloadStream.pipe(res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

interface UpdateRequestType {
  fullName?: string;
  username?: string;
}

const upload = multer({ dest: "uploads/" });

router.post(
  "/update", 
  checkAuthStatus, 
  upload.single("profilePicture"), 
  async (req: Request<{}, {}, UpdateRequestType>, res: Response) => {
    const userID = new Types.ObjectId(req.userID as string);
    const { fullName, username } = req.body;
    const pfp = req.file;

    if (!pfp && !username && !fullName) {
      res.status(304).json({message: "Nothing to update"});
      return;
    }

    const user = await UserModel.findById(userID);
    if (!user) {
      res.status(404).json({error: "User doesn't exist"});
      return;
    }

    if (fullName) {
      const validFullName = validateAndTrimFullname(fullName, res);
      if (!validFullName) return;
      user.fullName = validFullName;
    }

    if (username) {
      const nameTaken = await UserModel.findOne({ username: username });
      if (nameTaken) {
        res.status(403).json({ error: `User with this username already exists` });
        return;
      }
      if (!usernameValid(username, res)) return;
      user.username = username;
    }

    if (!pfp) {
      await user.save();
      sendUserData(user, res);
      return;
    }

    uploadProfilePic(pfp, async (fileID) => {
      user.profilePicture = fileID;
      await user.save();
      sendUserData(user, res);
    });
  }
);

export default router;
