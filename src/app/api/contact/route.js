import { NextResponse } from "next/server";
import connectDB from "@/lib/config/config";
import contactModel from "@/lib/models/contactModel";
connectDB();
export const POST = async (request) => {
  try {
    const { Name, Age, Gender } = await request.json();
    const address = process.env.ADDRESS;
    const professionalEmail = process.env.PROFESSIONAL_EMAIL;
    const personalEmail = process.env.PERSONAL_EMAIL;
    const phoneNumber = process.env.PHONE_NUMBER;
    const newContactUser = await contactModel.create({
      Name: Name,
      Age: Age,
      Gender: Gender,
    });
    console.log(`New contact user is ${newContactUser}`);
    return NextResponse.json(
      {
        message: "Data is fetched successfully !",
        address,
        professionalEmail,
        personalEmail,
        phoneNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error while contact user is ${error}`);
  }
};
