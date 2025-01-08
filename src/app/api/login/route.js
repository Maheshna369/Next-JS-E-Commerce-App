import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/config/config";
import registerModel from "@/lib/models/registerModel";

connectDB();
export const POST = async (request) => {
  try {
    const { Email, Password, otp } = await request.json();
    const secretKey = process.env.JWT_SECRET_KEY;
    if (otp) {
      const emailExists = await registerModel.findOne({ Email: Email });
      if (!emailExists) {
        return NextResponse.json(
          { message: "You are not registered, kindly sign up !" },
          { status: 200 }
        );
      }
      if (emailExists.Token) {
        const response = NextResponse.json(
          { message: "You are successfully signed in !" },
          { status: 200 }
        );
        const token = jwt.sign(emailExists.Email || Email, secretKey);
        response.cookies.set("MaphyCookie", token || emailExists.Token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Secure only in production
          secure: false,
          path: "/" || "lax",
        });
        console.log(`The token is ${token}`);
        console.log(
          `The cookie is ${response.cookies.get("MaphyCookie")?.value}`
        );
        return response;
      } else {
        return NextResponse.json(
          { message: "There is an issue while sign in, try after a while !" },
          { status: 200 }
        );
      }
    }
    const emailExists = await registerModel.findOne({ Email: Email });
    if (!emailExists) {
      return NextResponse.json(
        { message: "You are not registered, kindly sign up !" },
        { status: 200 }
      );
    }
    const hashPassword = emailExists.Password;
    const passwordCorrect = bcrypt.compare(Password, hashPassword);
    if (!passwordCorrect) {
      return NextResponse.json(
        { message: "Password is invalid !" },
        { status: 200 }
      );
    }
    if (emailExists.Token) {
      const response = NextResponse.json(
        { message: "You are successfully signed in !" },
        { status: 200 }
      );
      const token = jwt.sign(emailExists.Email || Email, secretKey);
      response.cookies.set("MaphyCookie", token || emailExists.Token);
      return response;
    } else {
      return NextResponse.json(
        { message: "There is an issue while sign in, try after a while !" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(`Error while login is ${error}`);
  }
};
