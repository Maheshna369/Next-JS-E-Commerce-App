"use client";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { useContext } from "react";
// import { RegisterContext } from "@/contexts/RegisterContextProvider";
import { LoginContext } from "@/contexts/LoginContextProvider";
import Register from "./Register";
import ForgetPassword from "./ForgetPassword";
const Login = () => {
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const { openLoginModal, setOpenLoginModal } = useContext(LoginContext);
  // const { openRegisterModal, setOpenRegisterModal } =
  //   useContext(RegisterContext);
  const [loading, setLoading] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ Email: "", Password: "" });
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      if (
        loginDetails.Email.trim() === "" ||
        loginDetails.Password.trim() === ""
      ) {
        return toast.error("Fill all the fields !");
      }
      setLoading(true);
      const response = await axios.post("/api/login", {
        Email: loginDetails.Email,
        Password: loginDetails.Password,
      });
      const data = response.data.message;
      if (
        data === "You are not registered, kindly sign up !" ||
        data === "Password is invalid !" ||
        data === "There is an issue while sign in, try after a while !"
      ) {
        toast.error(data);
        setLoading(false);
        return;
      }
      toast.success(data);
      window.location.reload();
    } catch (error) {
      console.error(`Error while login is ${error}`);
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
      {openLoginModal && (
        <div
          className={`w-screen h-screen flex flex-col justify-center items-center fixed inset-0 backdrop-blur-sm z-[1000] 
            ${openForgotPasswordModal ? "hidden" : ""}
          }`}
        >
          <div className="w-[75%] xl:w-[25%] flex justify-end items-center">
            <CloseIcon
              onClick={() => setOpenLoginModal(false)}
              className="place-self-end"
              color="white"
            />
          </div>
          <div className="w-[75%] xl:w-[25%] min-h-[50%] h-auto flex flex-col justify-evenly items-center bg-white border rounded-2xl">
            <h1 className="w-full flex justify-center items-center text-2xl font-extrabold text-[#0d6efd]">
              Sign In
            </h1>
            <form
              className="w-full flex flex-col justify-evenly items-center"
              onSubmit={(e) => handleLogin(e)}
            >
              <label className="w-full flex flex-col justify-center items-start px-5">
                <span className="text-lg font-medium">Email</span>
                <input
                  type="email"
                  onChange={(e) =>
                    setLoginDetails((prev) => {
                      return { ...prev, Email: e.target.value };
                    })
                  }
                  value={loginDetails.Email || ""}
                  placeholder="Enter Your Email..."
                  className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl`}
                />
              </label>
              <label className="w-full flex flex-col justify-center items-start px-5">
                <span className="text-lg font-medium">Password</span>
                <input
                  type="password"
                  onChange={(e) =>
                    setLoginDetails((prev) => {
                      return { ...prev, Password: e.target.value };
                    })
                  }
                  value={loginDetails.Password || ""}
                  placeholder="Enter Your Password..."
                  className={`w-full h-10 flex justify-center items-center text-lg font-medium px-3 py-2 border-2 rounded-xl`}
                />
              </label>
              <div className="w-full flex justify-evenly items-center">
                <button
                  type="button"
                  onClick={() => setLoginDetails({ Email: "", Password: "" })}
                  className="text-black border rounded-2xl px-5 py-3"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-[#0d6efd] text-white px-5 py-3 border rounded-2xl"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="w-full flex flex-col justify-center items-end pr-3">
              <span>
                Forgot Password,{" "}
                <span
                  onClick={() => setOpenForgotPasswordModal(true)}
                  className="text-blue-500"
                >
                  Click Here
                </span>
              </span>
              <span>
                Don't Have an Account?&nbsp;
                <span
                  onClick={() => setOpenLoginModal(false)}
                  className="text-blue-500"
                >
                  Sign Up
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
      {openForgotPasswordModal && (
        <ForgetPassword
          openForgotPasswordModal={openForgotPasswordModal}
          setOpenForgotPasswordModal={setOpenForgotPasswordModal}
        />
      )}
    </>
  );
};

export default Login;
