"use client"
import React from 'react'
import dynamic from 'next/dynamic'
const MyOrders= dynamic(()=>import("@/components/Profile/MyOrders"), {ssr: false})
const page = () => {
  return (
    <MyOrders/>
  )
}

export default page
