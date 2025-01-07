"use client"
import dynamic from "next/dynamic";
import React from "react";
const SearchComponent = dynamic(() =>
  import("@/components/Products/SearchComponent"), {ssr: false}
);
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});
const page = () => {
  return (
    <div className="w-screen h-auto min-h-screen relative top-40 xl:top-24 flex flex-col">
      <SearchComponent />
      <Footer />
    </div>
  );
};

export default page;
