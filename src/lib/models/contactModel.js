import mongoose from "mongoose";
const contactSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
});
const contactModel =
  mongoose.models.contactedusers ||
  mongoose.model("contactedusers", contactSchema);
export default contactModel;