"use client"
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { PropagateLoader } from "react-spinners";
import { useContext } from "react";
import { RegisterContext } from "@/contexts/RegisterContextProvider";
import { LoginContext } from "@/contexts/LoginContextProvider";
import Login from "./Login";
const Register = () => {
  const { openRegisterModal, setOpenRegisterModal } =
    useContext(RegisterContext);
  const { openLoginModal, setOpenLoginModal } = useContext(LoginContext);
  const [openOtpModal, setOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSendLoading, setOtpSendLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [registerDetails, setRegisterDetails] = useState({
    Name: "",
    Email: "",
    phoneNumber: "",
    Password: "",
    repeatPassword: "",
  });
  const handleSendOtp = async () => {
    try {
      setOtpSendLoading(true);
      if (
        registerDetails.Name.trim() === "" ||
        registerDetails.Email.trim() === ""
      ) {
        return toast.error("Fill all the fields !");
      }
      const response = await axios.post("/api/sendOtp", {
        email: registerDetails.Email,
      });
      const data = response.data.message;
      if (data === "You are already registered, Proceed to Sign In !") {
        return toast.error(data);
      }
      toast.success(data);
      if (data === "You are already registered, Proceed to Sign In !") {
        setOtpSendLoading(false);
        return;
      }
      setOtpModal(true);
    } catch (error) {
      console.error(`Error while sending the otp is ${error}`);
    } finally {
      setOtpSendLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      if (otp.trim() === "") {
        return toast.error("Enter the OTP !");
      }
      const response = await axios.post("/api/verifyOtp", {
        email: registerDetails.Email,
        otp: otp.toString(),
      });
      const data = response.data.message;
      if (data === "Invalid OTP") {
        return toast.error(data);
      }
      toast.success(data);
      setOtpVerified(true);
      setOtpModal(false);
    } catch (error) {
      console.error(`Error while verifying the otp is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async () => {
    try {
      setLoading(true);
      if (
        registerDetails.Name.trim() === "" ||
        registerDetails.Email.trim() === "" ||
        registerDetails.phoneNumber.trim() === "" ||
        registerDetails.Password.trim() === "" ||
        registerDetails.repeatPassword.trim() === ""
      ) {
        return toast.error("Fill all the fields !");
      }
      if (registerDetails.Password === registerDetails.repeatPassword) {
        const response = await axios.post("/api/register", {
          Name: registerDetails.Name,
          Email: registerDetails.Email,
          PhoneNumber: registerDetails.phoneNumber,
          Password: registerDetails.repeatPassword,
        });
        const data = response.data.message;
        if (data === "User is already registered, Sign In to continue !") {
          toast.error(data);
          return;
        }
        toast.success(data);
        window.location.reload();
      } else {
        return toast.error("Invalid Repeat Password");
      }
    } catch (error) {
      console.error(`Error while registration is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Toaster className="z-[2000]" position="top-right" />
      {loading && (
        <div className="w-screen h-screen flex justify-center items-center fixed inset-0 backdrop-blur-sm z-[2000]">
          <PropagateLoader />
        </div>
      )}
      {openRegisterModal && (
        <div
          className={`w-screen h-screen flex flex-col justify-center items-center fixed inset-0 backdrop-blur-sm z-[1000] ${
            openLoginModal ? "hidden" : ""
          }`}
        >
          <div className="w-[75%] xl:w-[25%] flex justify-end items-center">
            <CloseIcon
              onClick={() => setOpenRegisterModal(false)}
              className="place-self-end"
              color="white"
            />
          </div>
          <div className="w-[75%] xl:w-[25%] min-h-[75%] xl:min-h-[50%] h-auto flex flex-col justify-evenly items-center bg-white border rounded-2xl">
            <h1 className="w-full flex justify-center items-center text-2xl font-extrabold text-[#0d6efd]">
              Sign Up
            </h1>
            <label className="w-full flex flex-col justify-center items-start px-5">
              <span className="text-lg font-medium">Name</span>
              <input
                onChange={(e) =>
                  setRegisterDetails((prev) => {
                    return { ...prev, Name: e.target.value };
                  })
                }
                value={registerDetails.Name || ""}
                className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl ${
                  otpVerified ? "opacity-50" : ""
                }`}
                type="text"
                placeholder="Enter Your Name..."
                disabled={otpVerified}
              />
            </label>
            <label className="w-full flex flex-col justify-center items-start px-5">
              <span className="text-lg font-medium">Email</span>
              <div className="w-full flex flex-col justify-center items-center gap-3">
                <input
                  onChange={(e) =>
                    setRegisterDetails((prev) => {
                      return { ...prev, Email: e.target.value };
                    })
                  }
                  value={registerDetails.Email || ""}
                  type="email"
                  placeholder="Enter Your Email"
                  disabled={otpVerified}
                  className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl ${
                    otpVerified ? "opacity-50" : ""
                  }`}
                />
                {!otpVerified && (
                  <button
                    onClick={handleSendOtp}
                    disabled={otpVerified}
                    className="w-[50%] xl:w-[50%] bg-[#0d6efd] text-white px-3 py-2 border rounded-2xl flex justify-evenly items-center"
                  >
                    Send OTP {otpSendLoading && <ClipLoader size={"20"} />}
                  </button>
                )}
              </div>
            </label>
            {openOtpModal && (
              <label className="w-full flex flex-col justify-center items-start px-5">
                <span className="text-lg font-medium">OTP</span>
                <div className="w-full flex flex-row justify-between items-center">
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp || ""}
                    type="number"
                    placeholder="Enter Your OTP..."
                    className="w-[60%] h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="w-[30%] bg-[#0d6efd] text-white px-3 py-2 border rounded-2xl"
                  >
                    Submit
                  </button>
                </div>
              </label>
            )}
            <label className="w-full flex flex-col justify-center items-start px-5">
              <span className="text-lg font-medium">Mobile Number</span>
              <input
                onChange={(e) =>
                  setRegisterDetails((prev) => {
                    return { ...prev, phoneNumber: e.target.value };
                  })
                }
                value={registerDetails.phoneNumber || ""}
                type="number"
                placeholder="Enter Your Mobile Number..."
                disabled={!otpVerified}
                className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl ${
                  !otpVerified ? "opacity-50" : ""
                }`}
              />
            </label>
            <label className="w-full flex flex-col justify-center items-start px-5">
              <span className="text-lg font-medium">New Password</span>
              <input
                onChange={(e) =>
                  setRegisterDetails((prev) => {
                    return { ...prev, Password: e.target.value };
                  })
                }
                value={registerDetails.Password || ""}
                type="text"
                placeholder="Set Your Password..."
                disabled={!otpVerified}
                className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl ${
                  !otpVerified ? "opacity-50" : ""
                }`}
              />
            </label>
            <label className="w-full flex flex-col justify-center items-start px-5">
              <span className="text-lg font-medium">Repeat New Password</span>
              <input
                onChange={(e) =>
                  setRegisterDetails((prev) => {
                    return { ...prev, repeatPassword: e.target.value };
                  })
                }
                value={registerDetails.repeatPassword || ""}
                placeholder="Enter Your Password Again..."
                disabled={!otpVerified}
                className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl ${
                  !otpVerified ? "opacity-50" : ""
                }`}
                type="password"
              />
            </label>
            <div className="w-full flex justify-evenly items-center">
              <button
                onClick={() => {
                  setRegisterDetails({
                    Name: "",
                    Email: "",
                    phoneNumber: "",
                    Password: "",
                  });
                  setOtpVerified(false);
                }}
                className="text-black border rounded-2xl px-5 py-3"
              >
                Reset
              </button>
              <button
                onClick={handleRegister || ""}
                disabled={!otpVerified}
                className="bg-[#0d6efd] text-white px-5 py-3 border rounded-2xl"
              >
                Sign Up
              </button>
            </div>
            <span className="w-full flex justify-end items-center px-3 text-sm">
              Already have an Account?&nbsp;
              <span
                onClick={() => {
                  setOpenLoginModal(true);
                }}
                className="text-blue-500"
              >
                Sign In
              </span>
            </span>
          </div>
        </div>
      )}
      {openLoginModal && <Login />}
    </>
  );
};

export default Register;
