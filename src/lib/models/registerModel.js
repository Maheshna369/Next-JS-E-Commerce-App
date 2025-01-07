import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  Name: {
    required: true,
    type: String,
  },
  Email: {
    required: true,
    type: String,
    unique: true,
  },
  PhoneNumber: {
    required: true,
    type: String,
  },
  Password: {
    required: true,
    type: String,
  },
  Token: {
    required: true,
    type: String,
  },
});
const registerModel =
  mongoose.models.users || mongoose.model("users", registerSchema);
export default registerModel;
