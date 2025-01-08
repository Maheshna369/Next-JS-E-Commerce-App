"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import { RotateLoader } from "react-spinners";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Register from "./Register";
import { useContext } from "react";
import { RegisterContext } from "@/contexts/RegisterContextProvider";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import toast, { Toaster } from "react-hot-toast";
const Navbar = () => {
  const { openRegisterModal, setOpenRegisterModal } =
    useContext(RegisterContext);
  const menuRef = useRef();
  const categoryRef = useRef();
  const router = useRouter();
  const params = useSearchParams();
  const [openMenuBar, setOpenMenuBar] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("" || params.get("q") || "");
  const [payload, setPayload] = useState("");
  const [openMiniProfile, setOpenMiniProfile] = useState({
    menuBar: false,
    navBar: false,
    navBarP: false,
  });
  const handleMenuClose = (e) => {
    if (menuRef.current === e.target) {
      setOpenMenuBar(false);
      setOpenCategories(false);
    }
  };
  const handleCategoriesClose = (e) => {
    if (categoryRef.current === e.target) {
      setOpenCategories(!openCategories);
    }
  };
  const handleCategoryClick = (slug) => {
    try {
      setLoading(true);
      router.push(`/products/category/${slug}`);
      setOpenCategories(false);
      setOpenMenuBar(false);
    } catch (error) {
      console.error(`Error while navigating to category is ${error}`);
    } finally {
      setLoading(false);
    }
  };
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
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dummyjson.com/products/categories"
        );
        const data = response.data;

        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error while fetching categories is ${err}`);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  const handleSearch = (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      router.push(`/products/search?q=${search}`);
    } catch (error) {
      console.error(`Error while searching is ${error}`);
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
        setPayload(data);
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
      {openRegisterModal && (
        <Register
          openRegisterModal={openRegisterModal}
          setOpenRegisterModal={setOpenRegisterModal}
        />
      )}
      {loading && (
        <div className="w-screen h-screen z-[2000] backdrop-blur-sm fixed inset-0 flex justify-center items-center">
          <RotateLoader />
        </div>
      )}
      <Toaster position="top-center" />
      <div
        ref={menuRef}
        onClick={(e) => handleMenuClose(e)}
        className={`w-screen h-screen fixed inset-0 z-[1000] bg-black bg-opacity-0 flex justify-start items-center ${
          openMenuBar ? "visible" : "invisible"
        }`}
      >
        <div
          className={`w-[70%] h-screen bg-white shadow-xl transform transition-transform duration-1000 ease-in-out ${
            openMenuBar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="w-full h-[5%] flex justify-end items-center p-2">
            <CloseIcon
              onClick={() => setOpenMenuBar(false)}
              color="black"
              className="cursor-pointer"
            />
          </div>
          <div className="w-full h-10 flex justify-center items-center">
            <button
              onClick={() => {
                !payload && setOpenRegisterModal(true);
                !payload && setOpenMenuBar(false);
                payload &&
                  setOpenMiniProfile((prev) => {
                    return { ...prev, menuBar: !openMiniProfile.menuBar };
                  });
              }}
              className="relative"
            >
              {payload ? (
                <>
                  {payload} <AccountCircleIcon />
                  {openMiniProfile.menuBar && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-[100%] left-[50%] w-[200px] h-[150px] flex flex-col justify-evenly items-center bg-white border rounded-xl"
                    >
                      <Link
                        onClick={() =>
                          setOpenMiniProfile((prev) => {
                            return {
                              ...prev,
                              menuBar: !openMiniProfile.menuBar,
                            };
                          })
                        }
                        href={"/myprofile"}
                        className="w-full flex justify-center items-center text-xl font-bold"
                      >
                        My Profile
                        <AccountBoxIcon />
                      </Link>
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
          </div>
          <div className="w-full h-[95%] flex flex-col justify-evenly items-center">
            <ul className="w-full h-full flex flex-col justify-evenly items-start">
              <Link
                onClick={() => setOpenMenuBar(false)}
                className="px-5 py-3 text-xl"
                href={"/"}
              >
                <li>Home</li>
              </Link>
              <Link
                href={"#categories"}
                className="px-5 py-3 text-xl relative cursor-pointer"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor action
                  setOpenCategories(!openCategories); // Toggle state
                }}
              >
                <li className="flex items-center">
                  Categories{" "}
                  {openCategories ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </li>
                {openCategories && (
                  <ul
                    className={`absolute left-[50%] top-full bg-white text-black shadow-lg rounded-md mt-2 w-[250px] border max-h-[300px] overflow-y-auto transform transition-all duration-300 ease-in-out ${
                      openCategories
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-full invisible"
                    }`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
                  >
                    {categories.map((category, index) => (
                      <li
                        onClick={() => handleCategoryClick(category.slug)}
                        key={index}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
              <Link
                onClick={() => setOpenMenuBar(false)}
                className="px-5 py-3 text-xl"
                href={"/about"}
              >
                <li>About Us</li>
              </Link>
              <Link
                onClick={() => setOpenMenuBar(false)}
                className="px-5 py-3 text-xl"
                href={"/contact"}
              >
                <li>Contact Us</li>
              </Link>
            </ul>
          </div>
        </div>
      </div>

      <div className="h-40 w-screen xl:h-24 xl:w-screen bg-[#232F3E] text-[#ffff] fixed top-0 flex flex-col xl:flex-row justify-evenly items-center gap-4 z-[100]">
        <div className="w-screen xl:h-24 flex justify-between items-center">
          <div className="flex justify-center items-center gap-1">
            <div
              onClick={() => setOpenMenuBar(true)}
              className="mx-1 xl:hidden"
            >
              <MenuIcon />
            </div>
            <Link
              href={"/"}
              className="mx-1 xl:mx-4 text-lg xl:text-xl font-bold xl:font-extrabold"
            >
              <h1>Maphy's E-Commerce App</h1>
            </Link>
            <ul className="hidden xl:flex justify-evenly items-center xl:mx-1">
              <Link onClick={() => setOpenMenuBar(false)} href={"/"}>
                <li className="xl:text-lg px-3 py-2">Home</li>
              </Link>
              <Link onClick={() => setOpenMenuBar(false)} href={"/about"}>
                <li className="xl:text-lg px-3 py-2">About Us</li>
              </Link>
              <Link
                href={"#categories"}
                className="relative"
                onMouseEnter={() => setOpenCategories(!openCategories)}
                onMouseLeave={(e) => {
                  if (!categoryRef.current.contains(e.relatedTarget)) {
                    setOpenCategories(false);
                  }
                }}
              >
                <li className="xl:text-lg px-3 py-2">
                  Categories{" "}
                  {openCategories ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </li>
                {openCategories && (
                  <ul
                    ref={categoryRef}
                    className={`absolute left-0 top-7 bg-white text-black shadow-lg rounded-md mt-2 w-[250px] border max-h-[300px] overflow-y-auto transform transition-all duration-300 ease-in-out ${
                      openCategories
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-full invisible"
                    }`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
                  >
                    {categories.map((category, index) => (
                      <li
                        onClick={() => handleCategoryClick(category.slug)}
                        key={index}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
              <Link onClick={() => setOpenMenuBar(false)} href={"/contact"}>
                <li className="xl:text-lg px-3 py-2">Contact Us</li>
              </Link>
            </ul>
          </div>
          <div className="xl:flex hidden justify-evenly items-center px-5">
            <form
              className="w-screen xl:w-[500px] flex justify-center items-center"
              onSubmit={(e) => handleSearch(e)}
            >
              <div className="w-[90%] rounded-xl border bg-[#FFFF] focus:outline-none">
                <input
                  className="border-y-2 border-l-2 h-10 border-white rounded-xl text-black w-[90%] px-5 py-3 text-lg  focus:border-white focus:outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search an Item..."
                  value={search}
                />
                <button
                  className="w-[10%] h-11 bg-[#FEBD69] border rounded-xl"
                  type="submit"
                >
                  <SearchIcon className="bg-[#FEBD69] text-black" />
                </button>
              </div>
            </form>
            <div>
              <button
                onClick={() => {
                  !payload && setOpenRegisterModal(true);
                  payload &&
                    setOpenMiniProfile((prev) => {
                      return { ...prev, navBarP: !openMiniProfile.navBarP };
                    });
                }}
                className="mx-1 xl:mx-4 text-lg relative"
              >
                {payload ? (
                  <>
                    {payload} <AccountCircleIcon />
                    {openMiniProfile.navBarP && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-[100%] left-[-50%] w-[200px] h-[150px] flex flex-col justify-evenly items-center bg-white text-black border rounded-xl"
                      >
                        <Link
                          onClick={() =>
                            setOpenMiniProfile((prev) => {
                              return {
                                ...prev,
                                navBarP: !openMiniProfile.navBarP,
                              };
                            })
                          }
                          href={"/myprofile"}
                          className="w-full flex justify-center items-center text-xl font-bold"
                        >
                          My Profile
                          <AccountBoxIcon />
                        </Link>
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
            </div>
            <div onClick={() => router.push("/mycart")} className="xl:mx-4">
              <ShoppingCartOutlinedIcon />
            </div>
          </div>
          <div className="flex xl:hidden justify-center items-center gap-1">
            <button
              onClick={() => {
                !payload && setOpenRegisterModal(true);
                payload &&
                  setOpenMiniProfile((prev) => {
                    return { ...prev, navBar: !openMiniProfile.navBar };
                  });
              }}
              className="mx-1 text-lg relative"
            >
              {payload ? (
                <>
                  {payload} <AccountCircleIcon />
                  {openMiniProfile.navBar && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-[100%] left-[-100%] w-[200px] h-[150px] flex flex-col justify-evenly items-center bg-white text-black border rounded-xl z-[100]"
                    >
                      <Link
                        onClick={() =>
                          setOpenMiniProfile((prev) => {
                            return { ...prev, navBar: !openMiniProfile.navBar };
                          })
                        }
                        href={"/myprofile"}
                        className="w-full flex justify-center items-center text-xl font-bold"
                      >
                        My Profile
                        <AccountBoxIcon />
                      </Link>
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
          </div>
          <div
            onClick={() => router.push("/mycart")}
            className="mx-1 xl:hidden"
          >
            <ShoppingCartOutlinedIcon />
          </div>
        </div>
        <div className="w-screen flex xl:hidden justify-center items-center">
          <form
            className="w-screen flex justify-center items-center"
            onSubmit={(e) => handleSearch(e)}
          >
            <div className="w-[90%] rounded-xl border bg-[#FFFF]">
              <input
                className="border-y-2 border-l-2 h-10 border-white rounded-xl text-black w-[90%] px-5 py-3 text-lg"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                type="text"
                placeholder="Search an Item..."
              />
              <button
                className="w-[10%] h-11 bg-[#FEBD69] border rounded-xl"
                type="submit"
              >
                <SearchIcon className="bg-[#FEBD69] text-black" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
