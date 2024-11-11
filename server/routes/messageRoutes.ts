import { Router, Request, Response } from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import ChatModel, { ChatModelType } from "../db/models/chatModel";
import mongoose from "mongoose";
import MessageModel, { MessageModelType } from "../db/models/messageModel";

interface SendMessageRequest {
  message: string;
  receiverID: string;
}

const router = Router();

router.post(
  "/send",
  checkAuthStatus,
  async (req: Request<{}, {}, SendMessageRequest>, res: Response) => {
    try {
      const { receiverID, message } = req.body;
      const senderID = req.userID;

      const senderObjectID = new mongoose.Types.ObjectId(senderID);
      const receiverObjectID = new mongoose.Types.ObjectId(receiverID);

      let chat = await ChatModel.findOne({
        participants: { $all: [senderObjectID, receiverObjectID] },
      });

      if (!chat) {
        chat = new ChatModel({
          participants: [senderObjectID, receiverObjectID],
        });
        await chat.save();
      }

      const newMessage = new MessageModel({
        senderID: senderObjectID,
        receiverID: receiverObjectID,
        message: message,
      });
      await newMessage.save();

      chat.messages.push(newMessage._id);
      await chat.save();

      res.status(201).json({
        senderID: senderID,
        receiverID: receiverID,
        message: message,
      });
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get-all/:otherID",
  checkAuthStatus,
  async (req: Request, res: Response) => {
    try {
      const { otherID } = req.params;
      const currentObjID = new mongoose.Types.ObjectId(req.userID);
      const otherObjID = new mongoose.Types.ObjectId(otherID as string);

      const chat = await ChatModel.findOne({
        participants: { $all: [currentObjID, otherObjID] },
      }).populate<
        { messages: (MessageModelType & { createdAt: Date; upadtedAt: Date })[] }
      >("messages");

      if (!chat) {
        res.status(404).json({ messages: [] });
        return;
      }

      const filteredMessages = chat.messages.map((msg) => ({
        message: msg.message,
        createdAt: msg.createdAt,
      }));

      res.status(200).json({messages: filteredMessages});
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
