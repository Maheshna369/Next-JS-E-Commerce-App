import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },

  Orders: [
    {
      id: {
        type: String,
        required: true,
      },
      quantity: {
        type: String, // Quantity should be numerical
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
  ],
});

const orderModel =
  mongoose.models.totalorders || mongoose.model("totalorders", orderSchema);

export default orderModel;
