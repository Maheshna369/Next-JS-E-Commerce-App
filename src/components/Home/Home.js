"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import { RotateLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import axios from "axios";
const Home = () => {
  const router = useRouter();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };
  const handleCategoryClick = (slug) => {
    try {
      setLoading(true);
      router.push(`/products/category/${slug}`);
    } catch (error) {
      console.error(`Error while navigating to category is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleTrendingImageClick = (id) => {
    try {
      setLoading(true);
      router.push(`/singleProduct/${id}`);
    } catch (error) {
      console.error(`Error while clicking the product is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleTrendingItemClick = (id) => {
    try {
      setLoading(true);
      router.push(`/singleProduct/${id}`);
    } catch (error) {
      console.error(`Error while clicking the product is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dummyjson.com/products/categories"
        );
        const data = response.data;
        const res = await axios.get("https://dummyjson.com/products");
        const dat = res.data.products;
        const products = shuffleArray(dat).slice(0, 6);
        setCategories(data);
        const pricesInDollar = products.map((product) => product.price);

        setTrendingProducts(products);
        setLoading(false);
      } catch (error) {
        console.error(`Error while fetching the categories is ${error}`);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {loading && (
        <div className="z-[100] backdrop-blur-sm fixed inset-0 flex justify-center items-center">
          <RotateLoader />
        </div>
      )}
      <div
        className="h-[1460px] w-screen flex flex-col justify-start items-center  relative"
        id="home"
      >
        <div className="w-screen h-[460px] flex flex-col justify-center items-center gap-5">
          <h1 className="w-full h-[10%] flex justify-center items-center text-3xl font-bold text-yellow-400">
            Trending Items
          </h1>
          <div className="w-full h-[90%] flex flex-row justify-center items-center">
            <div className="product-carousel mt-4 mx-auto w-full max-w-4xl px-4 md:px-0">
              {/* Main Image Carousel */}
              <Swiper
                modules={[Pagination, Thumbs, Zoom]}
                // navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                zoom
                className="main-carousel"
                slidesPerView={1}
              >
                {trendingProducts.map((product, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-80 flex justify-center items-center overflow-hidden bg-gray-100">
                      <img
                        onClick={() => handleTrendingImageClick(product.id)}
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="w-full h-[500px] flex flex-wrap justify-evenly items-center gap-5 overflow-x-auto xl:overflow-y-auto border-2 rounded-xl border-red-500 px-5 py-3">
          <h1 className="w-full flex justify-center items-center py-3 text-[#0dfefd] text-3xl xl:text-5xl font-extrabold">
            Categories
          </h1>
          {categories.map((category, index) => {
            return (
              <div
                onClick={() => handleCategoryClick(category.slug)}
                className="w-1/3 xl:w-1/4 scrollbar-hide"
                key={index}
              >
                <Image
                  className="border rounded-2xl"
                  src={`/categories/${category.slug}.jpg`}
                  height={"300"}
                  width={"300"}
                  alt=""
                />
                <span className="text-lg font-bold w-full flex justify-center items-center">
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full h-[500px] flex flex-col justify-center items-center px-5 py-3 xl:px-10 xl:py-5">
          <h1 className="w-full h-[10%] flex justify-center items-center py-3 text-[#FFC200] text-3xl xl:text-5xl font-extrabold">
            Top Trending Items 🔥
          </h1>
          <div className="w-full h-[90%] overflow-y-auto flex flex-wrap justify-center items-center">
            {trendingProducts.map((product, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleTrendingItemClick(product.id)}
                  className="w-1/3 flex flex-col justify-center items-center"
                >
                  <Image
                    src={`${product.thumbnail}`}
                    height={"300"}
                    width={"300"}
                    alt=""
                  />
                  <span className="w-full flex justify-center items-center">
                    {product.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* <style jsx>{`
      .scrollbar-hide::{
      -webkit-scrollbar {
      display: none;
      }
      `}</style> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
