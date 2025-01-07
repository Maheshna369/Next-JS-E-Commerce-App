import axios from "axios";
import { NextResponse } from "next/server";
export const POST = async (request) => {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "id not found" }, { status: 400 });
    }
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    const product = response.data;
    return NextResponse.json({ product: product }, { status: 200 });
  } catch (error) {
    console.error(
      `Error while fetching the product details from api is ${error}`
    );
  }
};
