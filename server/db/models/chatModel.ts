import { model, Schema, Types } from "mongoose";

export interface ChatModelType {
  participants: Types.ObjectId[],
  messages: Types.ObjectId[],
}

const chatSchema = new Schema<ChatModelType>({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
      dafault: [],
    }
  ]
});

const ChatModel = model<ChatModelType>("Chat", chatSchema);
export default ChatModel;
