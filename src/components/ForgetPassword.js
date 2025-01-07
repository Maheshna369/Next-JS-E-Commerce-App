"use client"
import React, { useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader, PropagateLoader } from "react-spinners";
import axios from "axios";
const ForgetPassword = (props) => {
  const { openForgotPasswordModal, setOpenForgotPasswordModal } = props;
  const [loading, setLoading] = useState(false);
  const [otpSendLoading, setOtpSendLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const handleSendOtp = async () => {
    try {
      setOtpSendLoading(true);
      if (email.trim() === "") {
        return toast.error("Fill all the fields !");
      }
      const response = await axios.post("/api/sendOtpFP", {
        email: email,
      });
      const data = response.data.message;
      toast.success(data);
      setOtpVerified(true);
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
      const response = await axios.post("/api/verifyOtpFP", {
        email: email,
        otp: otp.toString(),
      });
      const data = response.data.message;
      if (data === "Invalid OTP") {
        return toast.error(data);
      }
      toast.success(data);
      setOtpVerified(true);
      
    } catch (error) {
      console.error(`Error while verifying the otp is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex justify-center items-center fixed inset-0 backdrop-blur-sm z-[2000]">
          <PropagateLoader />
        </div>
      )}
      <Toaster position="top-right" />
      {openForgotPasswordModal && (
        <div
          className={`w-screen h-screen flex flex-col justify-center items-center fixed inset-0 backdrop-blur-sm z-[1000]`}
        >
          <div className="w-[75%] xl:w-[25%] min-h-[50%] h-auto flex flex-col justify-evenly items-center bg-white border rounded-2xl">
            <ErrorOutlineIcon color="primary" sx={{ fontSize: 75 }} />
            <h1 className="w-full flex justify-center items-center text-3xl font-extrabold">
              Forgot Password
            </h1>
            <label
              className="w-full flex flex-col justify-center items-start px-5"
              htmlFor=""
            >
              <span className="text-lg font-medium">Email</span>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter Your Email..."
                disabled={otpVerified}
                className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl ${
                  otpVerified ? "opacity-50" : ""
                }`}
              />
            </label>
            <button
              onClick={handleSendOtp}
              disabled={otpVerified}
              className="bg-[#0d6efd] text-white px-5 py-3 border rounded-2xl flex justify-evenly items-center"
            >
              Submit {otpSendLoading && <ClipLoader size={"20"} />}
            </button>
            {otpVerified && (
              <>
                <label
                  className="w-full flex flex-col justify-center items-start px-5"
                  htmlFor=""
                >
                  <span className="text-lg font-medium">OTP</span>
                  <input
                    type="number"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl`}
                  />
                </label>
                <button onClick={handleVerifyOtp} className="bg-[#0d6efd] text-white px-5 py-3 border rounded-2xl">
                  Submit OTP
                </button>
              </>
            )}
            <div onClick={() => setOpenForgotPasswordModal(false)}>
              <ArrowBackIosIcon /> Back to the Page
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgetPassword;
