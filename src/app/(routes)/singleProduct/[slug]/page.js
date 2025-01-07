"use client";
import dynamic from "next/dynamic";
import React from "react";
const SingleProduct = dynamic(
  () => import("@/components/Products/SingleProduct"),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});
const page = ({ params }) => {
  const id = React.use(params).slug;
  return (
    <div className="w-screen h-auto min-h-screen relative top-40 xl:top-24 flex flex-col">
      <SingleProduct id={id} />
    </div>
  );
};

export default page;
