"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useContext } from "react";
import { RegisterContext } from "@/contexts/RegisterContextProvider";
import Register from "./Register";
import states from "./states.json";
import districts from "./districts.json";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Script from "next/script";
import toast, { Toaster } from "react-hot-toast";
import { OrderContext } from "@/contexts/OrderContextProvider";
const Checkout = () => {
  const router = useRouter();
  const { orderDetails, setOrderDetails } = useContext(OrderContext);
  const { openRegisterModal, setOpenRegisterModal } =
    useContext(RegisterContext);
  const params = useSearchParams();
  const [payload, setPayload] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    Name: payload,
    streetAddress: "",
    City: "",
    State: "State",
    District: "District",
    Pincode: "",
  });
  const [contactInfo, setContactInfo] = useState({
    Email: email,
    phoneNumber: "",
  });
  const [showStates, setShowStates] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [prices, setPrices] = useState({
    subTotal: "",
    fees: "",
    orderType: "",
  });
  const [productDetails, setProductsDetails] = useState([]);
  console.log(`The realPayload is ${email}`);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      price
    );
  };
  useEffect(() => {
    const fetchDatas = async () => {
      try {
        setLoading(true);
        console.log(orderDetails);
        const st = orderDetails.SubTotal;
        const pf = orderDetails.Fees;
        const orderType = orderDetails.OrderType;
        const response = await axios.get("/api/payload");
        const data = response.data.payload;
        const email = response.data.realPayload;
        setPayload(data);
        setAddressDetails((prev) => {
          return { ...prev, Name: data };
        });
        setEmail(email);
        setContactInfo((prev) => {
          return { ...prev, Email: email };
        });
        setPrices({ subTotal: st, fees: pf, orderType: orderType });
        setProductsDetails(orderDetails.Products);
        if (String(st).trim() === "" || String(pf).trim() === "") {
          return router.push("/mycart");
        }
      } catch (error) {
        console.error(`Error while fetching the payload is ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDatas();
  }, []);

  // Filter districts based on selected state
  const filteredDistricts = districts.filter(
    (district) => district.state_name_english === addressDetails.State
  );
  const handlePayment = async () => {
    // console.log("Name:", addressDetails.Name);
    // console.log("Street Address:", addressDetails.streetAddress);
    // console.log("City:", addressDetails.City);
    // console.log("State:", addressDetails.State);
    // console.log("District:", addressDetails.District);
    // console.log("Pincode:", addressDetails.Pincode);
    // console.log("Email:", contactInfo.Email);
    // console.log("Phone Number:", contactInfo.phoneNumber);
    if (
      addressDetails.Name.trim() === "" ||
      addressDetails.streetAddress.trim() === "" ||
      addressDetails.City.trim() === "" ||
      addressDetails.State.trim() === "State" ||
      addressDetails.District.trim() === "District" ||
      addressDetails.Pincode.trim() === "" ||
      contactInfo.Email.trim() === "" ||
      contactInfo.phoneNumber.trim() === ""
    ) {
      return toast.error("Fill all the fields !");
    }
    try {
      // Fetch the order_id and other payment data from your backend
      setLoading(true);
      const totalPrice = Number(prices.subTotal) + Number(prices.fees);
      const res = await axios.post("/api/payment", {
        amount: totalPrice * 100,
      });
      const { order_id, key, amount } = res.data;

      const options = {
        key, // Razorpay API key from backend
        amount, // Amount in paise
        currency: "INR",
        name: "Maphy's E-Commerce",
        description: "Transaction of order through e-commerce platform",
        order_id, // Generated order ID from backend
        handler: async (response) => {
          console.log("Payment Successful", response);
          if (prices.orderType === "cart") {
            localStorage.setItem("MaphyCart", []);
          }
          setOrderDetails((prev) => {
            return {
              ...prev,
              Name: `${addressDetails.Name}`,
              Address: `${addressDetails.streetAddress}, ${addressDetails.City}, ${addressDetails.District}- ${addressDetails.Pincode}, ${addressDetails.State}`,
              Email: `${contactInfo.Email}`,
              PhoneNumber: `${contactInfo.phoneNumber}`,
              // SubTotal: `${prices.subTotal}`,
              // Fees: `${prices.fees}`,
              // Products: `${productDetails}`,
            };
          });
          const orderResponse = await axios.post("/api/order", {
            PhoneNumber: orderDetails.PhoneNumber,
            OrderedProducts: productDetails || orderDetails.Products,
            Address: orderDetails.Address,
          });
          const data = orderResponse.data.message;
          toast.success(data);

          toast.success(
            "Order placed successfully! 🎉 Your payment is confirmed. Thank you for shopping with us!"
          );
          window.history.pushState(null, null, "/");
          // Use window.location.replace to redirect without leaving a trace
          window.location.replace("/");
          // Handle success logic, e.g., calling another API to confirm the payment
        },
        prefill: {
          name: "Mahesh Kumar Nayak",
          email: "merndeveloper.mahesh@gmail.com",
          contact: "8658533493",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Initialize Razorpay and open the dialog
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Toaster position="top-center" />
      {loading && (
        <div className="w-screen h-screen flex justify-center items-center fixed inset-0 backdrop-blur-sm z-[1000]">
          <MoonLoader />
        </div>
      )}
      {!payload && (
        <div className="h-auto w-screen flex justify-center items-center">
          <span className="h-24 text-3xl font-semibold flex justify-center items-center">
            <button
              onClick={() => setOpenRegisterModal(true)}
              className="text-blue-500"
            >
              Sign In
            </button>
            &nbsp;to Checkout <PriorityHighIcon color="primary" fontSize="50" />
          </span>
        </div>
      )}
      {openRegisterModal && <Register />}
      {payload && (
        <div className="w-screen h-auto flex flex-col justify-center items-center gap-3 bg-gray-400 px-5 py-3">
          <div className="w-[80%] h-auto flex flex-col justify-start items-center gap-3 bg-white border rounded-xl px-5 py-3">
            <span className="w-full justify-start items-center font-bold text-2xl">
              Delivery Address
            </span>
            <label htmlFor="">
              <span className="w-full justify-start items-center font-medium text-lg">
                Name
              </span>
              <input
                className="border-2 px-5 py-3 text-lg font-normal"
                onChange={(e) =>
                  setAddressDetails((prev) => {
                    return { ...prev, Name: e.target.value };
                  })
                }
                value={addressDetails.Name || ""}
                type="text"
                placeholder={payload || "Enter Your Name"}
                disabled={true}
              />
            </label>
            <label htmlFor="">
              <span className="w-full justify-start items-center font-medium text-lg">
                Street Address
              </span>
              <input
                onChange={(e) =>
                  setAddressDetails((prev) => {
                    return { ...prev, streetAddress: e.target.value };
                  })
                }
                value={addressDetails.streetAddress}
                className="border-2 px-5 py-3 text-lg font-normal"
                type="text"
                placeholder="Enter Your Street Address"
              />
            </label>
            <label htmlFor="">
              <span className="w-full justify-start items-center font-medium text-lg">
                City
              </span>
              <input
                onChange={(e) =>
                  setAddressDetails((prev) => {
                    return { ...prev, City: e.target.value };
                  })
                }
                value={addressDetails.City}
                className="border-2 px-5 py-3 text-lg font-normal"
                type="text"
                placeholder="Enter Your City"
              />
            </label>
            <div className="w-full flex justify-evenly items-center">
              <button
                className="relative px-5 py-3 border rounded-xl"
                onClick={() => setShowStates(!showStates)}
              >
                {showStates ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                {addressDetails.State}
                {showStates && (
                  <ul
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[100%] left-[-50%] flex flex-col justify-start items-center border rounded-xl w-[200px] h-[200px] overflow-auto bg-white z-10"
                  >
                    {states.map((stateDetails, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setAddressDetails((prev) => ({
                            ...prev,
                            State: stateDetails.state_name_english,
                            District: "District", // Reset district when state changes
                          }));
                          setShowStates(false);
                        }}
                        className="cursor-pointer hover:bg-gray-200 px-3 py-1"
                      >
                        {stateDetails.state_name_english}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
              <button
                className="relative px-5 py-3 border rounded-xl"
                onClick={() => setShowDistricts(!showDistricts)}
                disabled={addressDetails.State === "State"}
              >
                {showDistricts ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                {addressDetails.District}
                {showDistricts && (
                  <ul
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[100%] left-[-50%] flex flex-col justify-start items-center border rounded-xl w-[200px] h-[200px] overflow-auto bg-white"
                  >
                    {filteredDistricts.map((districtDetails, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setAddressDetails((prev) => ({
                            ...prev,
                            District: districtDetails.district_name_english,
                          }));
                          setShowDistricts(false);
                        }}
                        className="cursor-pointer hover:bg-gray-200 px-3 py-1"
                      >
                        {districtDetails.district_name_english}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            </div>
            <label>
              <span className="w-full justify-start items-center font-medium text-lg">
                Pincode
              </span>
              <input
                type="number"
                onChange={(e) =>
                  setAddressDetails((prev) => {
                    return { ...prev, Pincode: e.target.value };
                  })
                }
                value={addressDetails.Pincode}
                placeholder="Enter Your Pincode"
                className="border-2 px-5 py-3 text-lg font-normal"
              />
            </label>
          </div>
          <div className="w-[80%] h-auto flex flex-col justify-start items-center gap-3 bg-white border rounded-xl px-5 py-3">
            <span className="w-full justify-start items-center font-bold text-2xl">
              Contact Info
            </span>
            <label htmlFor="">
              <span className="w-full justify-start items-center font-medium text-lg">
                Email
              </span>
              <input
                type="email"
                onChange={(e) =>
                  setContactInfo((prev) => {
                    return { ...prev, Email: e.target.value };
                  })
                }
                value={contactInfo.Email || ""}
                placeholder={email || ""}
                disabled={true}
                className="border-2 px-5 py-3 text-lg font-normal"
              />
            </label>
            <label>
              <span className="w-full justify-start items-center font-medium text-lg">
                Mobile Number
              </span>
              <input
                type="number"
                onChange={(e) =>
                  setContactInfo((prev) => {
                    return { ...prev, phoneNumber: e.target.value };
                  })
                }
                value={contactInfo.phoneNumber}
                placeholder="Enter Your Number"
                className="border-2 px-5 py-3 text-lg font-normal"
              />
            </label>
          </div>
          <div className="w-[80%] h-auto flex flex-col justify-start items-center gap-3 bg-white border rounded-xl px-5 py-3">
            <span className="w-full flex justify-start items-center font-bold text-2xl border-b-5">
              Order Summary
            </span>
            <ul className="w-full flex flex-col justify-evenly items-center border rounded-xl px-5 py-3">
              <li className="w-full flex justify-between items-center">
                <span className="font-medium text-xl">SubTotal:</span>
                <span className="font-normal text-lg">
                  ₹{formatPrice(prices.subTotal)}
                </span>
              </li>
              <li className="w-full flex justify-between items-center">
                <span className="font-medium text-xl">Net Fees:</span>
                <span className="font-normal text-lg">
                  ₹{formatPrice(prices.fees)}
                </span>
              </li>
            </ul>
            <span className="w-full flex justify-between items-center font-semibold text-2xl">
              Total:
              <span className="font-normal text-lg">
                ₹{formatPrice(Number(prices.subTotal) + Number(prices.fees))}
              </span>
            </span>
          </div>
          <div className="w-full flex justify-center items-center">
            <button
              onClick={handlePayment}
              className="bg-[#0d6efd] text-white px-5 py-3 border rounded-xl"
            >
              Proceed to Save and Pay
            </button>
          </div>
        </div>
      )}

      <div className="w-screen h-40"></div>
    </>
  );
};

export default Checkout;
