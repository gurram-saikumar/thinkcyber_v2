"use client";
import React from "react";
import EditSubcategories from "@/app/components/Admin/Customization/EditSubcategories";

type Props = {};

const Page = (props: Props) => {
  return (    <div className="w-full max-w-[1200px] mx-auto p-5">
      <div className="border-l-4 border-blue-500 pl-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          Subcategories Management
        </h1>
      </div>
      <div className="flex justify-center">
        <EditSubcategories />
      </div>
    </div>
  );
};

export default Page;
