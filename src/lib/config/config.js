import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log(`MONGODB is connected to the server !`);
  } catch (error) {
    console.error(`Error while connecting the server to MONGODB is ${error}`);
  }
};
export default connectDB;