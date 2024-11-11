import { model, Schema } from "mongoose";

export interface UserModelType {
  fullName: string;
  username: string;
  password: string;
  profilePicture?: string;
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
  profilePicture: String,
});

const UserModel = model<UserModelType>("User", userSchema);
export default UserModel;
