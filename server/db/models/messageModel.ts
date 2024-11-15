import { model, Schema, Types } from "mongoose";

export interface MessageModelType {
  senderID: Types.ObjectId;
  receiverID: Types.ObjectId;
  message: string;
  createdAt: Date;
};

const messageSchema = new Schema<MessageModelType>(
  {
    senderID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MessageModel = model<MessageModelType>("Message", messageSchema);
export default MessageModel;
