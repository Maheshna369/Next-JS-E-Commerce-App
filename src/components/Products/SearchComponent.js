"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import SortIcon from "@mui/icons-material/Sort";
import { Filter } from "lucide-react";
import Star from "../Star";
import { PuffLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineStar } from "react-icons/ai";
import { useRouter } from "next/navigation";
const SearchComponent = () => {
  const params = useSearchParams();
  const router= useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);
  const [sortedResults, setSortedResults] = useState({ title: "", order: "" });
  // const priceInInr = async (priceInUSD) => {
  //   try {
  //     const response = await axios.post("/api/currencyconvert", { priceInUSD });
  //     return response.data.priceInInr || priceInUSD; // Fallback to USD if conversion fails
  //   } catch (error) {
  //     console.error(`Error converting price from USD to INR: ${error}`);
  //     return priceInUSD; // Return original price if error occurs
  //   }
  // };

  const originalPrice = (discount, discountedPrice) => {
    return Math.floor(discountedPrice + (discount / 100) * discountedPrice);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      price
    );
  };
  const handleSort = async (e) => {
    try {
      setLoading(true);
      const { title, order } = sortedResults;
      const sorted = [...products].sort((a, b) => {
        if (title === "title") {
          // Sort by title (alphabetical order)
          return a.title.localeCompare(b.title);
        }
        if (order === "asc") {
          // Sort by price (low to high)
          return a.price - b.price;
        }
        if (order === "desc") {
          // Sort by price (high to low)
          return b.price - a.price;
        }
        return 0;
      });

      setProducts(sorted);
    } catch (error) {
      console.error(`Error while sorting the products is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleClick=(id)=>{
    try {
      setLoading(true)
      router.push(`/singleProduct/${id}`)
    } catch (error) {
      console.error(`Error while clicking the product is ${error}`)
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q = params.get("q");
        const response = await axios.post("/api/products/s", { q });
        const data = response.data.products;
        // const updatedProducts = await Promise.all(
        //   data.map(async (product) => {
        //     const priceInr = await priceInInr(product.price);
        //     return { ...product, priceInInr: priceInr };
        //   })
        // );

        setProducts(data);
      } catch (error) {
        console.error(`Error fetching products: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);
  console.log(products);
  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex justify-center items-center backdrop-blur-sm fixed inset-0 z-[2000]">
          <PuffLoader />
        </div>
      )}
      <ToastContainer />
      <div className="w-screen h-auto">
        <div className="w-screen h-24 xl:h-40 flex justify-center items-center border-b-2">
          <div
            onClick={() => setOpenSortModal(!openSortModal)}
            className="w-[50%] relative flex justify-center items-center border-r-2"
          >
            <SortIcon /> Sort
            {openSortModal && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-[50%] top-0 w-[250px] h-[250px] flex flex-col justify-evenly items-center gap-3 xl:gap-5 bg-white text-black border-2 rounded-xl shadow-lg"
              >
                <label className="w-full flex justify-start items-center gap-3 px-3">
                  <input
                    type="checkbox"
                    checked={sortedResults.title === "title"}
                    onChange={() =>
                      setSortedResults((prev) => ({
                        ...prev,
                        title: prev.title === "title" ? "" : "title", // Toggle the title
                      }))
                    }
                  />
                  <span className="text-lg">Sort By Name</span>
                </label>

                <label className="w-full flex justify-start items-center gap-3 px-3">
                  <input
                    type="radio"
                    checked={sortedResults.order === "asc"} // Check if the current order is ascending
                    onChange={() =>
                      setSortedResults((prev) => ({
                        ...prev,
                        order: "asc", // Set order to ascending
                      }))
                    }
                  />
                  <span className="text-lg">Price from Low to High</span>
                </label>
                <label className="w-full flex justify-start items-center gap-3 px-3">
                  <input
                    type="radio"
                    checked={sortedResults.order === "desc"} // Check if the current order is ascending
                    onChange={() =>
                      setSortedResults((prev) => ({
                        ...prev,
                        order: "desc", // Set order to ascending
                      }))
                    }
                  />
                  <span className="text-lg">Price from High to Low</span>
                </label>
                <div className="w-full flex justify-evenly items-center">
                  <button onClick={() => setOpenSortModal(false)} className="">
                    Cancel
                  </button>
                  <button
                    onClick={(e) => handleSort(e)}
                    className="bg-[#0d6efd] text-white flex items-center justify-center px-3 py-1 border rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-[50%] flex justify-center items-center">
            <Filter
              onClick={() => toast.info("This feature is not activated, yet !")}
            />{" "}
            Filter
          </div>
        </div>
        <div className="w-screen h-auto flex xl:flex-wrap flex-col justify-center items-center gap-5 xl:gap-10">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
              onClick={()=>handleClick(product.id)}
                key={index}
                className="w-screen xl:w-1/3 flex xl:hidden justify-center items-center gap-3 mx-3 xl:mx-5 border-b-2"
              >
                <div className="flex justify-center items-center gap-3 xl:gap-5">
                  <Image
                    src={product.thumbnail}
                    height={200}
                    width={200}
                    alt="Product Thumbnail"
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="text-lg font-bold">{product.title}</span>
                  <Star rating={product.rating} />
                  <div className="flex justify-evenly items-center gap-3 xl:gap-5">
                    <span>-{Math.floor(product.discountPercentage)}%</span>
                    <span className="line-through">
                      ₹
                      {formatPrice(
                        originalPrice(
                          product.discountPercentage,
                          85 * product.price
                        )
                      )}
                    </span>
                    <span className="text-lg font-bold">
                      ₹{formatPrice(85 * product.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-screen flex xl:hidden justify-center items-center text-xl xl:text-3xl">
              No items available
            </div>
          )}
          {products.length > 0 ? (
            products.map((product, index) => {
              return (
                <div
                onClick={()=>handleClick(product.id)}
                  key={index}
                  className="w-screen xl:flex hidden justify-center items-center border-b-2"
                >
                  <div className="w-[25%] flex items-center justify-center">
                    <Image
                      src={`${product.thumbnail}`}
                      height={300}
                      width={300}
                      alt=""
                    />
                  </div>
                  <div className="w-[50%] flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold hover:text-[#0d6efd]">
                      {product.title}
                    </span>
                    <div className="flex justify-center items-center gap-3">
                      <span className="flex justify-center items-center gap-2 bg-[#388E3C] text-white px-3 py-2 border rounded-xl">{product.rating.toFixed(1)}<AiOutlineStar className="text-white"/></span>
                      <span className="text-xl">{product.reviews.length} reviews</span>
                    </div>
                  </div>
                  <div className="w-[25%] flex flex-col justify-evenly items-center">
                    <span className="flex justify-center items-center text-2xl font-bold">
                      ₹{formatPrice(85 * product.price)}
                    </span>
                    <div className="flex justify-center items-center gap-5 text-lg">
                      <span className="line-through">
                        ₹
                        {formatPrice(
                          originalPrice(
                            product.discountPercentage,
                            85 * product.price
                          )
                        )}
                      </span>
                      <span>-{Math.floor(product.discountPercentage)}%</span>
                    </div>
                    <span className="text-lg">
                      {85 * product.price >= 500
                        ? `Free Delivery- ${product.shippingInformation}`
                        : `Delivery- ${product.shippingInformation} with additional delivery charge of ₹29`}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="hidden xl:flex justify-center items-center text-3xl font-bold">No items available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
