"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "@/contexts/CartContextProvider";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { OrderContext } from "@/contexts/OrderContextProvider";
const MyCart = () => {
  const router = useRouter();
  const { orderDetails, setOrderDetails } = useContext(OrderContext);
  const [loading, setLoading] = useState(false);
  const [productsInCart, setProductsInCart] = useState([]);
  const {
    state,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
  const MaphyCart = localStorage.getItem("MaphyCart");
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      price
    );
  };
  const calculateSubtotal = () => {
    return state.Cart.reduce(
      (acc, product) => acc + product.quantity * Math.floor(85 * product.price),
      0
    );
  };
  const priceQuery = `st=${calculateSubtotal()}&pf=${
    100 + (calculateSubtotal() <= 500 ? 29 : 0)
  }&order_type=cart`;
  const handleCheckout = () => {
    try {
      setLoading(true);
      setOrderDetails((prev) => {
        const updatedDetails = {
          ...prev,
          SubTotal: calculateSubtotal(),
          Fees: `${100 + (calculateSubtotal() <= 500 ? 29 : 0)}`,
          OrderType: "cart",
          Products: productsInCart,
        };
        console.log(updatedDetails); // Debugging step
        return updatedDetails;
      });
      router.push("/checkout"); // Navigate to checkout
    } catch (error) {
      console.error(`Error while navigating to checkout: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductInformation = () => {
      if (MaphyCart) {
        const cartData = JSON.parse(MaphyCart); // Parse the cart data from localStorage
        const productDetails = cartData.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        }));

        setProductsInCart(productDetails); // Update the state with product details
        console.log(productDetails);
      }
    };
    fetchProductInformation();
  }, [MaphyCart]);
  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex justify-center items-center fixed inset-0 z-[1000] backdrop-blur-sm">
          <PuffLoader />
        </div>
      )}
      <div className="w-screen h-auto flex flex-col">
        {state.Cart.length ? (
          <ul className="w-screen flex justify-center items-center py-3 text-xl font-extrabold border-b-2">
            <li className="w-[25%] flex justify-center items-center">
              Product
            </li>
            <li className="w-[25%] flex justify-center items-center">Price</li>
            <li className="w-[25%] flex justify-center items-center">
              Quantity
            </li>
            <li className="w-[25%] flex justify-center items-center">
              SubTotal
            </li>
          </ul>
        ) : (
          ""
        )}
        <div
          className={`w-screen h-auto flex flex-col justify-center items-center gap-3 py-3 ${
            state.Cart.length ? "border-b-2" : ""
          }`}
        >
          {state.Cart.length ? (
            state.Cart.map((product, index) => {
              return (
                <ul
                  className="w-screen h-auto flex justify-evenly items-center"
                  key={index}
                >
                  <div className="w-[25%] flex flex-col xl:flex-row justify-center items-center">
                    <span className="w-[50%] flex justify-end items-center">
                      <ClearIcon
                        className=""
                        onClick={() => removeFromCart(product)}
                      />
                    </span>
                    <img
                      className="w-[50%] flex justify-center items-center"
                      src={product.thumbnail}
                      alt=""
                    />
                    <span className="w-[50%] flex justify-center items-center font-bold text-lg">
                      {product.title}
                    </span>
                  </div>
                  <li className="w-[25%] flex justify-center items-center font-medium text-lg">
                    ₹{formatPrice(Math.floor(85 * product.price))}
                  </li>
                  <li className="w-[25%] flex justify-center items-center font-medium text-lg">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                      className="w-[25%] flex justify-center items-center border"
                    >
                      -
                    </button>
                    <span className="w-[50%] flex justify-center items-center border">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(product.id)}
                      className="w-[25%] flex justify-center items-center border"
                    >
                      +
                    </button>
                  </li>
                  <li className="w-[25%] flex justify-center items-center font-medium text-lg">
                    ₹
                    {formatPrice(
                      product.quantity * Math.floor(85 * product.price)
                    )}
                  </li>
                </ul>
              );
            })
          ) : (
            <div className="w-screen h-auto flex justify-center items-center text-3xl font-extrabold">
              Cart is Empty
            </div>
          )}
        </div>
        {state.Cart.length ? (
          <div className="min-w-[screen] h-auto flex flex-col justify-evenly items-end gap-3 xl:gap-5 py-5 pr-3 xl:pr-5">
            <div className="w-[85%] xl:w-[50%] h-auto flex flex-col justify-evenly items-end gap-3 xl:gap-5 px-5 py-3 bg-orange-300 border rounded-xl">
              <div className="w-full flex justify-between items-center px-3 py-2 border rounded-xl">
                <span className="text-xl font-bold">SubTotal: </span>
                <span className="font-medium text-lg">
                  ₹{formatPrice(calculateSubtotal())}
                </span>
              </div>
              {calculateSubtotal() <= 500 && (
                <div className="w-full flex justify-between items-center px-3 py-2 border rounded-xl">
                  <span className="text-xl font-bold">Delivery Charges: </span>
                  <span className="font-medium text-lg">₹29</span>
                </div>
              )}
              <div className="w-full flex justify-between items-center px-3 py-2 border rounded-xl">
                <span className="text-xl font-bold">
                  Contribution for Maphy:{" "}
                </span>
                <span className="font-medium text-lg">₹100</span>
              </div>
              <div className="w-full flex justify-between items-center px-3 py-2 border rounded-xl">
                <span className="text-xl font-bold">Total: </span>
                <span className="font-medium text-lg">
                  ₹
                  {formatPrice(
                    calculateSubtotal() +
                      (calculateSubtotal() <= 500 ? 29 : 0) +
                      100
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className=" bg-[#0d6efd] text-white flex justify-center items-center px-5 py-3 border rounded-xl"
            >
              Proceed to Checkout
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="w-screen h-60"></div>
    </>
  );
};

export default MyCart;
