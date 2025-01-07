// app/api/send-otp/route.js

import nodemailer from "nodemailer";
import connectDB from "@/lib/config/config";
import otpModel from "@/lib/models/otpModel";
// import registerModel from "@/lib/models/registerModel";
import { NextResponse } from "next/server";
connectDB();
export const POST = async (request) => {
  const { email } = await request.json(); // Extract email and OTP from the request body
  //   const emailExists = await registerModel.findOne({ Email: email });
  //   if (emailExists) {
  //     return NextResponse.json(
  //       { message: "You are already registered, Proceed to Sign In !" },
  //       { status: 200 }
  //     );
  //   }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExists = await otpModel.findOne({ email });
  if (otpExists) {
    await otpModel.deleteOne({ email });
  }
  const newOtp = await otpModel.create({
    email: email,
    otp: otp,
  });
  if (!email || !otp) {
    return new Response(
      JSON.stringify({ message: "Email and OTP are required" }),
      { status: 400 }
    );
  }
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Gmail as the email service provider
    auth: {
      user: process.env.EMAIL_SERVER_USER, // Your email address (e.g., example@gmail.com)
      pass: process.env.EMAIL_SERVER_PASSWORD, // Your Gmail app password
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: email, // receiver address
    subject: "Your OTP Code",
    text: `Here is your OTP code: ${otp}`, // Plain text version
    html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="text-align: center; color: #4CAF50;">Maphy's Inc</h2>
      <p style="font-size: 16px;">Hi there,</p>
      <p style="font-size: 16px;">
        We received a request to reset your password.
        Please use the OTP below to proceed:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #777;">
        This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email or contact our support team.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #555; text-align: center;">
        © ${new Date().getFullYear()} Maphy, Inc. All rights reserved.
      </p>
    </div>`, // HTML version
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ message: "Failed to send OTP", error: error.message }),
      { status: 500 }
    );
  }
};
