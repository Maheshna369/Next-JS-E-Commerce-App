import { NextResponse } from "next/server";

export const GET = (request) => {
  try {
    const token = request.cookies.get("MaphyCookie")?.value;
    if (!token) {
      return NextResponse.json({
        message: "As Token is Empty, Logout is not possible !",
      });
    }

    const response = NextResponse.json({ message: "Logout is Successful !" });
    response.cookies.set("MaphyCookie", "", { path: "/", httpOnly: true });
    return response; // Ensure the response is returned
  } catch (error) {
    console.error(`Error while Logout is ${error}`);
    return NextResponse.json({
      message: "An error occurred during logout.",
      error: error.message,
    });
  }
};
