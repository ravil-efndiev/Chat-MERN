import { UserModelType } from "../db/models/userModel";
import { Response } from "express";
import { Types } from "mongoose";
import { sendAuthToken } from "./token";
import { bucket } from "../db/connect";
import fs from "fs";

type UserDocumentType = UserModelType & { _id: Types.ObjectId };

export function sendUserData(user: UserDocumentType, res: Response) {
  res.status(200).json({
    user: {
      id: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture?.toString(),
    },
  });
}

export function sendUserDataAndToken(user: UserDocumentType, res: Response) {
  sendAuthToken(user._id.toString(), res);
  sendUserData(user, res);
}

export function uploadProfilePic(
  pfp: Express.Multer.File
): Promise<Types.ObjectId> {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(pfp.filename);
    const fstream = fs.createReadStream(pfp.path);
    fstream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      fs.unlink(pfp.path, () => {});
      resolve(uploadStream.id);
    });

    uploadStream.on("error", (err) => {
      fs.unlink(pfp.path, () => {});
      reject(err);
    });
  });
}
