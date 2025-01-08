"use client";
import React from "react";
import dynamic from "next/dynamic";
const ContactMe = dynamic(() => import("@/components/ContactMe"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const page = () => {
  return (
    <div className="w-screen h-auto min-h-screen relative top-40 xl:top-24 flex flex-col">
      <ContactMe />
      <Footer/>
    </div>
  );
};

export default page;
