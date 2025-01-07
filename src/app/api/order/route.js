import { NextResponse } from "next/server";
import connectDB from "@/lib/config/config";
import registerModel from "@/lib/models/registerModel";
import orderModel from "@/lib/models/orderModel";
import jwt from "jsonwebtoken";

connectDB();

export const POST = async (request) => {
  try {
    const { PhoneNumber, Address, OrderedProducts } = await request.json();
    const token = request.cookies.get("MaphyCookie")?.value;
    const secretKey = process.env.JWT_SECRET_KEY;

    // Verify the token
    const payload = jwt.verify(token, secretKey);
    if (!payload) {
      return NextResponse.json(
        {
          message: "Invalid or empty token. Please log in again!",
        },
        { status: 400 }
      );
    }

    // Check if user exists in `registerModel`
    const emailExists = await registerModel.findOne({ Email: payload });
    if (!emailExists) {
      return NextResponse.json(
        {
          message: "User is not registered. Order cannot be saved!",
        },
        { status: 400 }
      );
    }

    // Check if the email exists in `orderModel`
    const emailExistsInOrders = await orderModel.findOne({
      Email: payload,
    });

    // if (emailExistsInOrders) {
    //   // If email exists, push each product into the existing `Orders` array
    //   OrderedProducts.forEach((product) => {
    //     emailExistsInOrders.Orders.push({
    //       id: product.id,
    //       quantity: product.quantity,
    //       address: Address,
    //       phoneNumber: PhoneNumber,
    //     });
    //   });

    //   await emailExistsInOrders.save();
    //   console.log(emailExistsInOrders);
    //   return NextResponse.json({
    //     message: "Order added successfully to the existing user!",
    //   });
    // } else {
    //   // If email does not exist, create a new document in `orderModel`
    //   const newOrder = new orderModel({
    //     Email: payload,
    //     Orders: OrderedProducts.map((product) => ({
    //       id: product.id,
    //       quantity: product.quantity,
    //       address: Address,
    //       phoneNumber: PhoneNumber,
    //     })),
    //   });

    //   await newOrder.save();
    //   console.log(newOrder);
    //   return NextResponse.json({
    //     message: "Order saved successfully for the new user!",
    //   });
    // }
    if (emailExistsInOrders) {
        // If email exists, push each product into the existing `Orders` array
        OrderedProducts.forEach((product) => {
          emailExistsInOrders.Orders.push({
            id: product.id,
            quantity: product.quantity,
            address: Address,  // Same Address for all orders
            phoneNumber: PhoneNumber,  // Same PhoneNumber for all orders
          });
        });
      
        await emailExistsInOrders.save();
        console.log(emailExistsInOrders);
        return NextResponse.json({
          message: "Order added successfully to the existing user!",
        });
      } else {
        // If email does not exist, create a new document in `orderModel`
        const newOrder = new orderModel({
          Email: payload,
          Orders: OrderedProducts.map((product) => ({
            id: product.id,
            quantity: product.quantity,
            address: Address,  // Same Address for all orders
            phoneNumber: PhoneNumber,  // Same PhoneNumber for all orders
          })),
        });
      
        await newOrder.save();
        console.log(newOrder);
        return NextResponse.json({
          message: "Order saved successfully for the new user!",
        });
      }
      
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      {
        message: "An error occurred while saving the order.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
