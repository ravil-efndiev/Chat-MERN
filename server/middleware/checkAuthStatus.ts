import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

declare module "express-serve-static-core" {
  interface Request {
    userID?: string;
  }
}

function checkAuthStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      res.status(401).json({ error: "Not Authenticated" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(".env variables aren't properly set up");
    }

    jwt.verify(
      token as string,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Invalid token" });
        }

        const decodedPayload = decoded as jwt.JwtPayload;

        req.userID = decodedPayload.id;
        next();
      }
    );
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default checkAuthStatus;
