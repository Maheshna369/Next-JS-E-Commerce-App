import { NextResponse } from "next/server";
import connectDB from "@/lib/config/config";
import registerModel from "@/lib/models/registerModel";
import orderModel from "@/lib/models/orderModel";
import jwt from "jsonwebtoken";
import axios from "axios";

// Establish database connection
connectDB();

export const GET = async (request) => {
  try {
    // Extract token from cookies
    const token = request.cookies.get("MaphyCookie")?.value;
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!token) {
      return NextResponse.json(
        { message: "Token is not present!" },
        { status: 400 }
      );
    }

    // Verify the token
    const payload = jwt.verify(token, secretKey);
    if (!payload) {
      return NextResponse.json(
        {
          message:
            "Payload is not present as the token is invalid or tampered!",
        },
        { status: 400 }
      );
    }

    // Check if the user exists
    const emailExists = await registerModel.findOne({ Email: payload });
    if (!emailExists) {
      return NextResponse.json(
        { message: "User is not present in the database!" },
        { status: 400 }
      );
    }

    // Check if orders exist for the user
    const emailExistsInOrders = await orderModel.findOne({ Email: payload });
    if (!emailExistsInOrders) {
      return NextResponse.json(
        { message: "There are no orders!" },
        { status: 200 }
      );
    }

    // Fetch product details for each order
    const ordersWithProductDetails = await Promise.all(
      emailExistsInOrders.Orders.map(async (order) => {
        try {
          const productResponse = await axios.get(
            `https://dummyjson.com/products/${order.id}`
          );
          return {
            id: order.id,
            address: order.address,
            phoneNumber: order.phoneNumber,
            orderedQuantity: order.quantity, // Renaming quantity
            productDetails: productResponse.data, // Product details
          };
        } catch (error) {
          console.error(
            `Failed to fetch product for order ID ${order.id}: ${error}`
          );
          return {
            id: order.id,
            address: order.address,
            phoneNumber: order.phoneNumber,
            orderedQuantity: order.quantity, // Renaming quantity
            productDetails: "", // Product details
          };
        }
      })
    );

    // Return orders with product details as a response
    return NextResponse.json(
      {
        message: "Orders and product details fetched successfully!",
        orders: ordersWithProductDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error while fetching orders: ${error}`);
    return NextResponse.json(
      {
        message: "An error occurred while fetching orders.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
