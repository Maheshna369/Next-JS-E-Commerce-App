"use client";
import React from "react";
import dynamic from "next/dynamic";
const AboutMe = dynamic(() => import("@/components/AboutMe"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const page = () => {
  return (
    <div className="w-screen h-[1600px] xl:h-[1400px] min-h-screen relative top-40 xl:top-24 flex flex-col">
      <AboutMe />
      <Footer />
    </div>
  );
};

export default page;
