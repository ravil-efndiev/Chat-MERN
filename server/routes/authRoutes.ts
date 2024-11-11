import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../db/models/userModel";
import { generateToken as setAuthToken, clearToken } from "../utils/token";
import { UserModelType } from "../db/models/userModel";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { passwordValid, usernameValid, validateAndTrimFullname } from "../utils/validation";

interface LoginRequest {
  username: string;
  password: string;
}

const router = express.Router();

router.post("/register", async (req: Request<{}, {}, UserModelType>, res: Response) => {
  try {
    const { fullName, username, password } = req.body;

    if (!usernameValid(username, res)) return;
    if (!passwordValid(password, res)) return;

    const validFullName = validateAndTrimFullname(fullName, res);
    if (!validFullName) return;

    const userExists = await UserModel.findOne({ username: username });
    if (userExists) {
      res.status(400).json({ error: `User with this username already exists` });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new UserModel({
      fullName: validFullName,
      username: username,
      password: passwordHash,
    });

    await user.save();

    setAuthToken(user._id.toString(), res);
    res.status(200).json({
      id: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username: username });

      if (!user) {
        res.status(404).json({ error: `Invalid username` });
        return;
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        res.status(400).json({ error: `Invalid password` });
        return;
      }

      setAuthToken(user._id.toString(), res);
      
      res.status(200).json({
        id: user._id.toString(),
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      });
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/logout", (req: Request, res: Response) => {
  try {
    clearToken(res);
    res.status(200).json({message: "Successfully logged out"});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/status", checkAuthStatus, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userID);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      id: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
