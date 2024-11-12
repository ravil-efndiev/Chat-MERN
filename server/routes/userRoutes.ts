import { Router, Request, Response } from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { Types } from "mongoose";
import ChatModel from "../db/models/chatModel";
import UserModel, { UserModelType } from "../db/models/userModel";

const router = Router();

router.get(
  "/get-chats", checkAuthStatus,
  async (req: Request, res: Response) => {
    try {
      const userID = new Types.ObjectId(req.userID);

      const chats = await ChatModel.find({ participants: userID })
        .populate<{ participants: (UserModelType & {_id: Types.ObjectId})[] }>("participants");

      const users = chats.map((chat) => {
        const other = chat.participants.find(
          (participant) => !participant._id.equals(userID)
        );

        return {
          id: other?._id.toString(),
          username: other?.username,
          fullName: other?.fullName,
          profilePicture: other?.profilePicture,
        }
      });

      res.status(200).json({users: users});
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get-by-username/:username", checkAuthStatus, 
  async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const userID = new Types.ObjectId(req.userID);

      const user = await UserModel.findOne({ 
        username: username,
        _id: { $ne: userID } 
      });

      if (!user) {
        res.status(404).json({error: "User not found"});
        return;
      }

      res.status(200).json({
        user: {
          id: user._id.toString(),
          username: user.username,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        }
      });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get-by-id/:id", checkAuthStatus, 
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(new Types.ObjectId(id));

      if (!user) {
        res.status(404).json({error: "User not found"});
        return;
      }

      res.status(200).json({
        user: {
          id: id,
          username: user.username,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        }
      });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
