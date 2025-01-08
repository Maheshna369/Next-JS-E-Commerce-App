import React, { useRef, useState } from "react";
import { DotLoader } from "react-spinners";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const ContactMe = () => {
  const [contactDetails, setContactDetails] = useState({
    Name: "",
    Age: "",
    Gender: "",
  });
  const [adminDetails, setAdminDetails] = useState({
    Address: "",
    professionalEmail: "",
    personalEmail: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [contactUserVerfied, setContactUserVerified] = useState(false);
  const contactRef = useRef();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        contactDetails.Name.trim() === "" ||
        contactDetails.Age.trim() === "" ||
        contactDetails.Gender.trim() === ""
      ) {
        return toast.error("Fill all the fields !");
      }
      if (contactDetails.Age > 0) {
        setLoading(true);
        const response = await axios.post("/api/contact", {
          Name: contactDetails.Name,
          Age: contactDetails.Age,
          Gender: contactDetails.Gender,
        });
        const msg = response.data.message;
        const { address, professionalEmail, personalEmail, phoneNumber } =
          response.data;
        setAdminDetails({
          Address: address,
          professionalEmail: professionalEmail,
          personalEmail: personalEmail,
          phoneNumber: phoneNumber,
        });
        setContactUserVerified(true);
        toast.success(msg);
      }
    } catch (error) {
      console.log(`Error while getting admin details is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex justify-center items-center fixed inset-0 backdrop-blur-sm z-[1000]">
          <DotLoader />
        </div>
      )}
      <Toaster position="top-center" />
      <div className="main w-screen h-[500px] bg-[url('/contactmeformobile.jpg')] xl:bg-[url('/contactmeforpc.jpg')] bg-cover bg-opacity-50 bg-center flex justify-center items-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-[75%] h-[75%] flex flex-col  justify-evenly items-center bg-white shadow-2xl text-black border rounded-xl px-3 py-2 z-10"
        >
          <span className="w-full flex  justify-center items-center text-3xl font-bold">
            Fill the Form
          </span>
          <label
            className="w-full flex flex-col justify-start items-center"
            htmlFor=""
          >
            <span className="w-full flex justify-start items-center font-medium text-xl">
              Name
            </span>
            <input
              onChange={(e) =>
                setContactDetails((prev) => {
                  return { ...prev, Name: e.target.value };
                })
              }
              value={contactDetails.Name}
              className="w-full flex justify-start items-center border-b-2 outline-none text-lg font-normal px-3 py-2"
              type="text"
              placeholder="Enter Your Name..."
            />
          </label>
          <label
            className="w-full flex flex-col justify-start items-center"
            htmlFor=""
          >
            <span className="w-full flex justify-start items-center font-medium text-xl">
              Age
            </span>
            <input
              onChange={(e) =>
                setContactDetails((prev) => {
                  return { ...prev, Age: e.target.value };
                })
              }
              value={contactDetails.Age}
              className="w-full flex justify-start items-center border-b-2 outline-none text-lg font-normal px-3 py-2"
              type="number"
              placeholder="Enter Your Age"
            />
          </label>
          <label
            className="w-full flex flex-col justify-start items-center"
            htmlFor=""
          >
            <span className="w-full flex justify-center items-center font-medium text-xl">
              Gender
            </span>
            <div className="w-full flex justify-evenly items-center">
              <label
                className="flex justify-center items-center"
                htmlFor="male"
              >
                <span className="w-full flex justify-center items-center font-medium text-lg pr-2">
                  Male
                </span>
                <input
                  onChange={(e) =>
                    setContactDetails((prev) => {
                      return { ...prev, Gender: e.target.value };
                    })
                  }
                  value={"Male"}
                  checked={contactDetails.Gender === "Male"}
                  type="radio"
                  id="male"
                />
              </label>
              <label
                className="flex justify-center items-center"
                htmlFor="female"
              >
                <span className="w-full flex justify-center items-center font-medium text-lg pr-2">
                  Female
                </span>
                <input
                  onChange={(e) =>
                    setContactDetails((prev) => {
                      return { ...prev, Gender: e.target.value };
                    })
                  }
                  value={"Female"}
                  checked={contactDetails.Gender === "Female"}
                  type="radio"
                  id="female"
                />
              </label>
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-black text-white flex justify-center items-center border rounded-xl"
            >
              Submit Form
            </button>
          </label>
        </form>
      </div>
      {contactUserVerfied && (
        <div
          ref={contactRef}
          onClick={(e) => {
            if (contactRef.current === e.target) {
              setContactUserVerified(false);
            }
          }}
          className="w-screen h-screen fixed inset-0 backdrop-blur-sm flex flex-col justify-center items-center z-[1000]"
        >
          <div className="w-[80%] flex justify-end items-center">
            <CloseIcon
              onClick={() => setContactUserVerified(false)}
              className="place-self-end"
            />
          </div>
          <div className="w-[80%] h-[75%] flex flex-col justify-evenly items-center bg-white border rounded-xl px-3 py-2">
            <span className="text-blue-500 text-3xl font-bold">
              Contact Details
            </span>
            <div className="w-full flex justify-start items-center text-xl font-medium">
              Address: {adminDetails.Address}
            </div>
            <div className="w-full flex justify-start items-center text-xl font-medium">
              Professional Email: {adminDetails.professionalEmail}
            </div>
            <div className="w-full flex justify-start items-center text-xl font-medium">
              Personal Email: {adminDetails.personalEmail}
            </div>
            <div className="w-full flex justify-start items-center text-xl font-medium">
              Phone Number: {adminDetails.phoneNumber}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactMe;
