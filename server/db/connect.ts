import mongoose from "mongoose";

async function connectDB() {
  try {
    if (!process.env.DB_URI)
      throw new Error("No database URI in .env");
    await mongoose.connect(process.env.DB_URI);
    console.log("connected to db");
  }
  catch (err) {
    console.error(err);
  }
}

export default connectDB;
