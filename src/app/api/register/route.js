import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/config/config";
import registerModel from "@/lib/models/registerModel";
connectDB();
export const POST = async (request) => {
  try {
    const { Name, Email, PhoneNumber, Password } = await request.json();
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!Name || !Email || !PhoneNumber || !Password) {
      return NextResponse.json(
        { message: "Field is empty, fill all the fields" },
        { status: 400 }
      );
    }
    const emailExists = await registerModel.findOne({ Email });
    if (emailExists) {
      return NextResponse.json(
        { message: "User is already registered, Sign In to continue !" },
        { status: 200 }
      );
    }
    const hashPassword = await bcrypt.hash(Password, 10);
    const token = jwt.sign(Email, secretKey);
    if (!token) {
      return NextResponse.json(
        { message: "token is not created due to some issue !" },
        { status: 400 }
      );
    }
    const newUser = await registerModel.create({
      Name: Name,
      Email: Email,
      PhoneNumber: PhoneNumber,
      Password: hashPassword,
      Token: token,
    });
    console.log(`New User is registered, details: ${newUser}`);
    const response = NextResponse.json(
      { message: "You are successfully registered !" },
      { status: 200 }
    );
    response.cookies.set("MaphyCookie", token);
    return response;
  } catch (error) {
    console.error(`Error while registration is ${error}`);
  }
};
