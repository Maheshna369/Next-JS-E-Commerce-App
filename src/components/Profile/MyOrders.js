import axios from "axios";
import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  console.log(orders);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      price
    );
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        const data = response.data.orders;
        const msg = response.data.message;
        setOrders(data);
      } catch (error) {
        console.log(`Error while fetching the orders is ${error}`);
      }
    };
    fetchOrders();
  }, []);
  return (
    <div className="w-screen h-auto relative top-40 xl:top-24 flex flex-col justify-center items-center">
      <span className="text-3xl font-extrabold w-full flex justify-center items-center">
        All Orders
      </span>
      <div className="w-full flex flex-col justify-center items-center gap-3 xl:gap-5">
        {orders.map((order, index) => {
          return (
            <div
              className="w-full flex justify-center items-center gap-3 border rounded-xl px-3 py-2"
              key={index}
            >
              <div className="w-[25%] flex flex-col justify-center items-center">
                <img src={order.productDetails.thumbnail} alt="" />
                <span className="w-full flex justify-center items-center text-xl font-bold">
                  {order.productDetails.title}×{order.orderedQuantity}
                </span>
                <span className="w-full flex justify-center items-center text-lg font-medium">
                  ₹
                  {formatPrice(
                    order.productDetails.price * 85 +
                      100 +
                      (order.productDetails.price * 85 <= 500 ? 29 : 0)
                  )}
                </span>
              </div>
              <div className="w-[75%] flex flex-col justify-center items-center gap-3">
                <span className="w-full flex justify-start items-center text-xl font-normal">
                  Delivery Address:
                  {order.address}
                </span>
                <span className="w-full flex justify-start items-center text-xl font-normal">
                  Phone Number: {order.phoneNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
