import { Router, Request, Response } from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import ChatModel from "../db/models/chatModel";
import { Types } from "mongoose";
import MessageModel, { MessageModelType } from "../db/models/messageModel";
import { io, userSocketIDs } from "../server";

interface SendMessageRequestType {
  message: string;
  receiverID: string;
}

type MessageDocumentType = MessageModelType & { _id: Types.ObjectId };

function createRespMessage(
  message: MessageDocumentType,
  writtenByMe: boolean
) {
  return {
    message: {
      id: message._id.toString(),
      message: message.message,
      createdAt: message.createdAt,
      writtenByMe: writtenByMe,
    },
  };
}

const router = Router();

router.post(
  "/send", checkAuthStatus,
  async (req: Request<{}, {}, SendMessageRequestType>, res: Response) => {
    try {
      const { receiverID, message } = req.body;
      const senderID = req.userID;

      if (!message) {
        res.status(400).json({error: "Message is empty"});
        return;
      }

      const senderObjectID = new Types.ObjectId(senderID);
      const receiverObjectID = new Types.ObjectId(receiverID);

      let chat = await ChatModel.findOne({
        participants: { $all: [senderObjectID, receiverObjectID] },
      });

      if (!chat) {
        chat = new ChatModel({ participants: [senderObjectID, receiverObjectID] });
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

      const socketID = userSocketIDs.get(receiverID);

      if (socketID) {
        io.to(socketID).emit("message", {
          senderID: senderID,
          ...createRespMessage(newMessage, false),
        });
      }

      res.status(201).json(createRespMessage(newMessage, true));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get-all/:otherID", checkAuthStatus,
  async (req: Request, res: Response) => {
    try {
      const { otherID } = req.params;
      const currentObjID = new Types.ObjectId(req.userID);
      const otherObjID = new Types.ObjectId(otherID as string);

      const chat = await ChatModel.findOne({
        participants: { $all: [currentObjID, otherObjID] },
      }).populate<
        { messages: (MessageModelType & { _id: Types.ObjectId })[] }
      >("messages");

      if (!chat) {
        res.status(404).json({ messages: [] });
        return;
      }

      const filteredMessages = chat.messages.map((msg) => ({
        id: msg._id.toString(),
        writtenByMe: currentObjID.equals(msg.senderID),
        message: msg.message,
        createdAt: msg.createdAt,
      }));

      res.status(200).json({messages: filteredMessages});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
