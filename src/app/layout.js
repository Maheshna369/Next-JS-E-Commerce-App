import "./globals.css";
import Navbar from "@/components/Navbar";
import { RegisterProvider } from "@/contexts/RegisterContextProvider";
import { LoginProvider } from "@/contexts/LoginContextProvider";
import { CartProvider } from "@/contexts/CartContextProvider";
import { OrderProvider } from "@/contexts/OrderContextProvider";

export const metadata = {
  title: `Maphy's E-Commerce/Home`,
  description: `Welcome to Maphy’s E-Commerce, Your one-stop online destination for the best deals on a wide variety of products...`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body className="relative min-h-screen h-[100%] w-full">
        <OrderProvider>
          <CartProvider>
            <RegisterProvider>
              <LoginProvider>
                <Navbar />
                {children}
              </LoginProvider>
            </RegisterProvider>
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
