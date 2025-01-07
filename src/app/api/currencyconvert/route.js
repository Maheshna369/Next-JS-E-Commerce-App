import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { priceInUSD } = await request.json();
    const apiKey = process.env.CURRENCY_CONVERTER_KEY;

    // Ensure you're awaiting the API call
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );

    // Check if conversion rates for INR exist
    if (response.data.conversion_rates && response.data.conversion_rates.INR) {
      const data = response.data.conversion_rates.INR;
      const priceInInr = data * priceInUSD;
      return NextResponse.json({ priceInInr: priceInInr }, { status: 200 });
    } else {
      console.error("INR conversion rate not found in API response");
      return NextResponse.json(
        { error: "INR conversion rate not found" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error while converting USD to INR: ${error}`);
    return NextResponse.json(
      { error: "Failed to convert USD to INR" },
      { status: 500 }
    );
  }
};
