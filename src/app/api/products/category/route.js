import axios from "axios";
import { NextResponse } from "next/server";
export const POST = async (request) => {
  try {
    const { category } = await request.json();
    if (!category) {
      return NextResponse.json(
        { message: "category is invalid" },
        { status: 400 }
      );
    }
    const response = await axios.get(
      `https://dummyjson.com/products/category/${category}`
    );
    const data = response.data.products;
    console.log(`The products of ${category} is: ${data}`);
    return NextResponse.json({ products: data }, { status: 200 });
  } catch (error) {
    console.error(`Error while getting the products by category is ${error}`);
  }
};
