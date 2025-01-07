import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { title, order, q } = await request.json();
    // const q = url.searchParams.get("q");
    if ((!title && !order)) {
      return NextResponse.json({ sortedProducts: "" }, { status: 200 });
    }
    if (title) {
      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${q}&sortBy=${title}`
      );
      const data = response.data.products;
      console.log(data)
      return NextResponse.json({ sortedProducts: data }, { status: 200 });
    }
    if (order) {
      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${q}&order=${order}`
      );
      const data = response.data.products;
      console.log(data)
      return NextResponse.json({ sortedProducts: data }, { status: 200 });
    }
    if (order && title) {
      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${q}&sortBy=${title}&order=${order}`
      );
      const data = response.data.products;
      console.log(data)
      return NextResponse.json({ sortedProducts: data }, { status: 200 });
    }
  } catch (err) {
    console.error(`Error while fetching the searched data is ${err}`);
  }
};
