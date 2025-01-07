"use client"
import React from "react";
import dynamic from "next/dynamic";

const CategoryProducts = dynamic(
  () => import("@/components/Products/CategoryProducts"),
  {
    ssr: false,
  }
);
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});
const page = ({ params }) => {
  const category = React.use(params).slug;
  return (
    <div className="w-screen h-auto min-h-screen relative top-40 xl:top-24 flex flex-col">
      <CategoryProducts category={category} />
      <Footer />
    </div>
  );
};

export default page;
