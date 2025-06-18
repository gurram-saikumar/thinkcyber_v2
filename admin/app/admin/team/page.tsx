"use client";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React from "react";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import AllUsers from "../../components/Admin/Users/AllUsers";

type Props = {};

const page = (props: Props) => {
  return ( 
   <div className="w-full max-w-[1200px] mx-auto p-5">
      <div className="border-l-4 border-blue-500 pl-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          Manage Team
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          View and manage team members and their roles
        </p>
      </div>
        <AllUsers isTeam={true} />
    </div> 
  );
};

export default page;
