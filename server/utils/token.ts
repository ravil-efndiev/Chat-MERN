import jwt from "jsonwebtoken";
import { Response } from "express";

export function generateToken(id: string, res: Response) {
  if (!process.env.JWT_SECRET || !process.env.DEV_MODE) {
    throw new Error(".env variables aren't properly set up");
  }

  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.DEV_MODE !== "true",
    maxAge: 60 * 60 * 1000,
  });
}

export function clearToken(res: Response) {
  res.cookie("authToken", "", { 
    maxAge: 0,
    httpOnly: true,
  });
}
