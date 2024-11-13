import mongoose, { Mongoose } from "mongoose";
import { Db, GridFSBucket } from "mongodb";

export let bucket: GridFSBucket;

async function connectDB() {
  try {
    if (!process.env.DB_URI)
      throw new Error("No database URI in .env");
    await mongoose.connect(process.env.DB_URI);
    const connection = mongoose.connection;
    bucket = new GridFSBucket(connection.db as Db, {
      bucketName: "profilePictures",
    })
  }
  catch (err) {
    console.error(err);
  }
}

export default connectDB;
