"use client"
import React from "react";
import dynamic from "next/dynamic";
const MyProfile = dynamic(() => import("@/components/Profile/MyProfile"));
const page = () => {
  return <MyProfile />;
};

export default page;
