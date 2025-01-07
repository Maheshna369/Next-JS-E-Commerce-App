"use client"
import React from "react";

import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/Home/Home"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});
const Page = () => {
  return (
    <div className=" relative top-40 h-[1700px]">
      <Home />
      <Footer />
    </div>
  );
  // return <Home />;
};

export default Page;
