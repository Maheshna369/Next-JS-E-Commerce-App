"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import Register from "./Register";
import { useContext } from "react";
import { RegisterContext } from "@/contexts/RegisterContextProvider";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { RotateLoader } from "react-spinners";
const Footer = () => {
  const { openRegisterModal, setOpenRegisterModal } =
    useContext(RegisterContext);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState("");
  const [email, setEmail] = useState("");
  const [openMiniProfile, setOpenMiniProfile] = useState(false);
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
        const response = await axios.get("/api/payload");
        const data = response.data.payload;
        const email = response.data.email;
        setPayload(data);
        setEmail(email);
      } catch (error) {
        console.error(`Error while fetching the payload is ${error}`);
      }
    };
    fetchPayload();
  }, []);
  return (
    <>
      {loading && (
        <div className="z-[100] backdrop-blur-sm fixed inset-0 flex justify-center items-center">
          <RotateLoader />
        </div>
      )}
      <Toaster />
      <div className="absolute bottom-[-10%] h-60 w-screen bg-black text-white flex flex-col justify-center items-center">
        <span className="w-full h-[25%] bg-[#37475A] flex justify-center items-center">
          <Link href={"#home"}>
            <ArrowDropUpIcon color="white" />
          </Link>
        </span>
        <div className="w-full h-[50%] bg-[#232F3E] text-white flex justify-evenly items-center">
          <ul className="w-[50%] h-full flex flex-col justify-evenly items-center">
            <Link href={"#"}>
              <li>Your Account</li>
            </Link>
            <Link href={"#"}>
              <li>Your Orders</li>
            </Link>
            <Link href={"#"}>
              <li>Your Cart</li>
            </Link>
          </ul>
          <ul className="w-[50%] h-full flex flex-col justify-evenly items-center">
            <Link href={"/about"}>
              <li>About Us</li>
            </Link>
            <Link href={"/contact"}>
              <li>Contact Us</li>
            </Link>
          </ul>
        </div>
        <div className="w-full h-[25%] bg-[#0D141E] text-white flex flex-col justify-center items-center">
          <button
            onClick={() => {
              !payload && setOpenRegisterModal(true);
              payload && setOpenMiniProfile(!openMiniProfile);
            }}
            className="w-full h-[50%] flex justify-center items-center relative"
          >
            {payload ? (
              <>
                {payload} <AccountCircleIcon />
                {openMiniProfile && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-[100%] w-[200px] h-[150px] flex flex-col justify-evenly items-center bg-white text-black border rounded-xl"
                  >
                    <span onClick={()=>setOpenMiniProfile(!openMiniProfile)} className="w-full flex justify-center items-center text-xl font-bold">
                      My Profile
                      <AccountBoxIcon />
                    </span>
                    <span
                      onClick={handleLogout}
                      className="w-full flex justify-center items-center text-xl font-bold"
                    >
                      Logout
                      <LogoutIcon />
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                Sign In <AccountCircleOutlinedIcon />
              </>
            )}
          </button>
          <div className="w-full h-[50%] flex justify-center items-center">
            &copy; 2024 Maphy, Inc. All Rights Reserved.
          </div>
        </div>
      </div>
      {openRegisterModal && <Register />}
    </>
  );
};

export default dynamic(() => Promise.resolve(Footer), { ssr: false });
