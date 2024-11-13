import { model, Schema, Types } from "mongoose";

export interface UserModelType {
  fullName: string;
  username: string;
  password: string;
  profilePicture?: Types.ObjectId;
}

const userSchema = new Schema<UserModelType>({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: Schema.Types.ObjectId,
    ref: "fs.files",
  },
});

const UserModel = model<UserModelType>("User", userSchema);
export default UserModel;
