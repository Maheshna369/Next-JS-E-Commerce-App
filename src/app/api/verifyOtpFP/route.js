// app/api/verify-otp/route.js
import { NextResponse } from "next/server";
import otpModel from "@/lib/models/otpModel";
import connectDB from "@/lib/config/config";
import axios from "axios";
connectDB();
export const POST = async (request) => {
  const { email, otp } = await request.json(); // Extract email and OTP from the request body
  // Check if OTP exists for the given email
  console.log("Verifying OTP for email:", email, "with OTP:", otp);

  const otpExists = await otpModel.findOne({ email });
  // If no OTP exists or OTP has expired, return error
  if (!otpExists) {
    return new NextResponse(JSON.stringify({ message: "Invalid OTP" }), {
      status: 400,
    });
  }
  // Verify if the OTP entered by the user matches the stored OTP
  if (otpExists.otp === otp) {
    // OTP is correct
    // You can clear the OTP after successful verification if it's only for one-time use
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";
    const response = await axios.post(`${apiBaseUrl}/api/login`, {
      Email: email,
      Password: "",
      otp: otp,
    });
    const data = response.data.message;
    console.log(`The data is ${data}`);
    await otpModel.deleteOne({ email });
    return new NextResponse(
      JSON.stringify({ message: "OTP verified successfully" }),
      { status: 200 }
    );
  } else {
    // OTP doesn't match
    return new NextResponse(JSON.stringify({ message: "Invalid OTP" }), {
      status: 400,
    });
  }
};
