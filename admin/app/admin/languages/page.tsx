"use client";
import React from "react";
import EditLanguages from "@/app/components/Admin/Customization/EditLanguages";
import { IoLanguageOutline } from "react-icons/io5";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h1 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
              Languages Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Create and manage available languages for your platform
            </p>
          </div> 
        </div>
        
        <div className="bg-[#F5F7F9] dark:bg-gray-900 p-6 rounded-lg">
          <EditLanguages />
        </div>
      </div>
    </div>
  );
};

export default Page;
