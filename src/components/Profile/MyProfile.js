"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import toast, { Toaster } from "react-hot-toast";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
const MyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/logout");
      const data = response.data.message;
      toast.success(data);
      window.location.reload();
    } catch (error) {
      console.error(`Error while Logout is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPayload = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/payload");
        const data = response.data.payload;
        const email = response.data.realPayload;
        setPayload(data);
        setEmail(email);
      } catch (error) {
        console.error(`Error while fetching the payload is ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPayload();
  }, []);
  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex justify-center items-center fixed inset-0 backdrop-blur-sm z-[1000]">
          <HashLoader />
        </div>
      )}
      <Toaster position="top-center" />
      <div className="w-screen relative top-40 xl:top-24 flex flex-col justify-center items-center">
        <div className="intro-page w-full h-60 flex flex-col justify-center items-center">
          <span className="w-screen flex justify-start items-center">
            <ArrowBackIcon
              onClick={() => router.back()}
              className="place-self-start"
            />
          </span>
          <img
            className="w-32 h-32 md:w-40 md:h-40 border rounded-full object-cover"
            src="/defaultImage.jpg"
            alt=""
          />
          <span className="w-[50%] h-[12.5%] flex justify-center items-center text-white">
            {payload}
          </span>
          <span className="w-[50%] h-[12.5%] flex justify-center items-center text-white">
            {email}
          </span>
        </div>
        <ul className="w-screen h-auto">
          <li
            onClick={() => toast.error("This feature is yet to be available !")}
            className="w-full text-2xl font-bold flex justify-between items-center border px-5 py-3 "
          >
            <ManageAccountsIcon />
            Modify Profile Details
            <ChevronRightIcon />
          </li>
          <Link href={"/myprofile/myorders"}>
            <li className="w-full text-2xl font-bold flex justify-between items-center border px-5 py-3 ">
              <ShoppingBagIcon />
              My Orders
              <ChevronRightIcon />
            </li>
          </Link>
          <Link href={"/mycart"}>
            <li className="w-full text-2xl font-bold flex justify-between items-center border px-5 py-3 ">
              <ShoppingCartIcon />
              My Cart
              <ChevronRightIcon />
            </li>
          </Link>
          <li
            onClick={handleLogout}
            className="w-full text-2xl font-bold flex justify-between items-center border px-5 py-3 "
          >
            <LogoutIcon />
            Logout
            <ChevronRightIcon />
          </li>
        </ul>
      </div>
      <style jsx>
        {`
          .intro-page {
            background: linear-gradient(
              -45deg,
              #ee7752,
              #e73c7e,
              #23a6d5,
              #23d5ab
            );
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }

          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </>
  );
};

export default MyProfile;
