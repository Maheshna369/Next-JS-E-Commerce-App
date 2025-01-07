import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
  },
  otp: {
    required: true,
    type: String,
  },
});
const otpModel = mongoose.models.otpStorage || mongoose.model("otpStorage", otpSchema);
export default otpModel;
