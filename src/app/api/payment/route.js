import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const POST = async (Request) => {
  const { amount } = await Request.json();
  try {
    const order = await razorpay.orders.create({
      amount: amount.toString(),
      currency: "INR",
    });

    // Make sure you're sending the key_id and other details as part of the response
    return NextResponse.json({
      message: "Payment is successful",
      status: 200,
      order_id: order.id,
      key: process.env.RAZORPAY_KEY_ID, // Send the key here
      amount: order.amount,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error while processing the payment in server side.",
      status: 400,
    });
  }
};
