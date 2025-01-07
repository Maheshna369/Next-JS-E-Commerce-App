"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RotateLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";
import Star from "../Star";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useContext } from "react";
import { CartContext } from "@/contexts/CartContextProvider";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OrderContext } from "@/contexts/OrderContextProvider";
const SingleProduct = (props) => {
  const id = props.id;
  const { orderDetails, setOrderDetails } = useContext(OrderContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [activeImg, setActiveImg] = useState("");
  const { state, addToCart } = useContext(CartContext);
  const originalPrice = (discount, discountedPrice) => {
    return Math.floor(discountedPrice + (discount / 100) * discountedPrice);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      price
    );
  };
  const handleBuyNow = () => {
    try {
      setLoading(true);
      setOrderDetails((prev) => {
        return {
          ...prev,
          SubTotal: `${Math.floor(product.price * 85)}`,
          Fees: ` ${(product.price * 85 <= 500 ? 29 : 0) + 100}`,
          Products: [...prev.Products, { id: `${product.id}`, quantity: "1" }],
        };
      });
      router.push(`/checkout`);
    } catch (error) {
      console.error(`Error while buy now click is ${error}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`/api/singleProduct`, { id });
        const product = response.data.product;
        setProduct(product);
      } catch (error) {
        console.error(`Error while getting the product is ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]); // Add id as a dependency to refetch if it changes
  console.log(`The cart data is : ${localStorage.getItem("MaphyCart")}`);
  return (
    <>
      <Toaster position="top-right" />
      {loading && (
        <div className="w-screen h-screen fixed inset-0 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <RotateLoader />
        </div>
      )}
      <div className="w-screen h-24 fixed bottom-0 bg-white z-[500] flex justify-between items-center">
        <span
          onClick={() => {
            const isInCart =
              state.Cart.findIndex((item) => item.id === product.id) !== -1;
            if (!isInCart) {
              addToCart(product);
              toast.success("Added to the Cart!");
            } else {
              router.push("/mycart");
            }
          }}
          className="bg-white text-black px-5 py-3 flex justify-center items-center border-2 rounded-xl mx-3"
        >
          <AddShoppingCartIcon />
          {state.Cart.findIndex((item) => item.id === product.id) !== -1
            ? "Go To Cart"
            : "Add To Cart"}
        </span>

        <span
          onClick={handleBuyNow}
          className="bg-[#FFC200] text-black px-5 py-3 flex justify-center items-center border-2 rounded-xl mx-3 cursor-pointer"
        >
          Buy Now
        </span>
      </div>
      {imgModal && (
        <div className="w-screen h-screen fixed inset-0 flex flex-col justify-center items-center z-[1000] bg-white overflow-hidden">
          <div className="w-full flex justify-end items-center px-5">
            <CloseIcon
              onClick={() => setImgModal(false)}
              color="black"
              className="place-self-end"
            />
          </div>
          <img
            src={activeImg}
            alt=""
            className="w-[50%] h-[75%] flex justify-center items-center object-contain"
          />
        </div>
      )}
      <div className="w-screen h-auto min-h-screen relative flex  flex-col justify-center items-center gap-5">
        {/* Product Title */}
        {/* Product Image Carousel */}
        {product.images && product.images.length > 0 && (
          <div className="product-carousel mt-4 mx-auto w-full max-w-4xl px-4 md:px-0">
            {/* Main Image Carousel */}
            <Swiper
              modules={[Navigation, Pagination, Thumbs, Zoom]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              zoom
              className="main-carousel"
              slidesPerView={1}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-80 flex justify-center items-center overflow-hidden bg-gray-100">
                    <img
                      onClick={() => {
                        setActiveImg(image);
                        setImgModal(true);
                      }}
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <div className="w-screen text-3xl font-extrabold flex justify-center items-center">
          {product.title}
        </div>
        <div className="flex justify-center items-center gap-3">
          <Star rating={product.rating} />
          <span className="text-[#22A148]">
            {product?.rating?.toFixed(1) ? product.rating.toFixed(1) : 0}
          </span>
          <span className="text-[#2A55E5]">
            {/* {product.reviews.length} reviews */}
          </span>
        </div>
        <div className="w-screen flex justify-center items-center gap-3">
          <span className="text-[#22A148] text-2xl font-bold">
            <ArrowDownwardIcon />
            {product.discountPercentage}%
          </span>
          <span className="line-through text-[#DBDCDD] font-extrabold text-3xl">
            ₹
            {formatPrice(
              originalPrice(product.discountPercentage, 85 * product.price)
            )}
          </span>
          <span className="font-extrabold text-3xl">
            {" "}
            ₹{formatPrice(85 * product.price)}
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <span className="w-screen flex justify-start items-center px-5">
            {85 * product.price > 500
              ? "Free Delivery"
              : "+ ₹29 Delivery Charges"}
          </span>
          <span className="w-screen flex justify-start items-center px-5 font-bold">
            {product.shippingInformation}
          </span>
        </div>
        <div className="border-b-2">
          <span className="w-screen flex justify-start items-center py-5 px-5 border-b-2 text-3xl font-bold">
            Product Details
          </span>
          <ul className="w-screen flex flex-col justify-start items-center gap-3 !list-disc">
            <li className="w-screen flex justify-start items-center px-5 text-2xl font-normal">
              Brand- {product.brand || "Unknown"}
            </li>
            <li className="w-screen flex justify-start items-center px-5 text-2xl font-normal">
              {product.description}
            </li>
            <li className="w-screen flex justify-start items-center px-5 text-2xl font-normal">
              Weight-
              {Math.floor(product.weight / 2.205)}kg
            </li>
            <li className="w-screen flex flex-col justify-start items-center py-3 text-2xl font-normal">
              Dimensions
              <ul className="flex justify-evenly items-center gap-3">
                <li className="text-2xl font-normal px-3">
                  Length{" "}
                  {product?.dimensions?.depth
                    ? Math.floor(product.dimensions.depth)
                    : "N/A"}
                  mm
                </li>
                <li className="text-2xl font-normal">
                  Width{" "}
                  {product?.dimensions?.width
                    ? Math.floor(product.dimensions.width)
                    : "N/A"}
                  mm
                </li>
                <li className="text-2xl font-normal">
                  Height{" "}
                  {product?.dimensions?.height
                    ? Math.floor(product.dimensions.height)
                    : "N/A"}
                  mm
                </li>
              </ul>
            </li>
            <li className="w-screen flex justify-start items-center px-5 text-2xl font-normal">
              {product.warrantyInformation}
            </li>
            <li className="w-screen flex justify-start items-center px-5 text-2xl font-normal">
              {product.returnPolicy}
            </li>
          </ul>
        </div>
        <div className="w-screen flex flex-col justify-center items-center gap-5">
          <div className="w-[90%] flex justify-center items-center">
            <Star rating={product.rating} />
          </div>
          <div className="text-[#22A148]">
            {product?.rating?.toFixed(1) ? product.rating.toFixed(1) : 0}
            {""} and {product?.reviews?.length ? product.reviews.length : "0"}{" "}
            reviews
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <span className="pb-3 border-b-2 text-3xl font-bold">
              Customer Reviews
            </span>
            {product?.reviews?.length > 0 ? (
              product.reviews.map((review, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-start items-center gap-2"
                  >
                    <div className="w-full flex justify-center items-center gap-2">
                      <span>
                        <Star rating={review.rating} />
                      </span>
                      <span className="text-[#22A148]">
                        {review?.rating?.toFixed(1)
                          ? review.rating.toFixed(1)
                          : 0}
                      </span>
                    </div>
                    <div className="w-full flex justify-center items-center text-sm text-[#717478]">
                      On {new Date(review.date).toLocaleString()}, By{" "}
                      {review.reviewerName}
                    </div>
                    <div className="w-full flex justify-center items-center text-2xl font-bold">
                      {review.comment}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No Reviews, yet !</div>
            )}
          </div>
        </div>
      </div>
      <div className="h-24"></div>
    </>
  );
};

export default SingleProduct;
