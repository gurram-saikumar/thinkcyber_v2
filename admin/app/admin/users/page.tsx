'use client'
import React from 'react'
import AllUsers from "../../components/Admin/Users/AllUsers";
import { Box, Typography } from "@mui/material";

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-5">
      <div className="border-l-4 border-blue-500 pl-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          Users Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage all registered users and their roles
        </p>
      </div>
      <AllUsers />
    </div>
  )
}

export default Page