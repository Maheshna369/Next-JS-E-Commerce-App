import { NextResponse } from "next/server";
import connectDB from "@/lib/config/config";
import registerModel from "@/lib/models/registerModel";
import jwt from "jsonwebtoken";

connectDB();
export const GET = async (request) => {
  try {
    const token = request.cookies.get("MaphyCookie")?.value;
    if (!token) {
      return NextResponse.json({ payload: "" }, { status: 200 });
    }
    console.log(`Token is ${token}`);
    const secretKey = process.env.JWT_SECRET_KEY;
    let email;
    try {
      email = jwt.verify(token, secretKey);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Either the token is invalid/tempered or the key is invalid",
        },
        { status: 400 }
      );
    }
    console.log(`Payload is ${email}`);
    const emailExists = await registerModel.findOne({ Email: email });
    if (!emailExists) {
      return NextResponse.json(
        { message: "user is not registered, do register first !" },
        { status: 200 }
      );
    }
    const name = emailExists.Name;
    console.log(`Name is ${name}`);
    return NextResponse.json({ payload: name, realPayload: emailExists.Email || email }, { status: 200 });
  } catch (error) {
    console.error(`Error while getting the payload is ${error}`);
  }
};
