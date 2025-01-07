import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const {q} = await request.json();
    // const q = url.searchParams.get("q");
    const response = await axios.get(
      `https://dummyjson.com/products/search?q=${q}`
    );
    const data = response.data.products;
    return NextResponse.json({ products: data }, { status: 200 });
  } catch (err) {
    console.error(`Error while fetching the searched data is ${err}`);
  }
};
