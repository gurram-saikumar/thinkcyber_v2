"use client";
import React from "react";
import DashboardHero from "../components/Admin/DashboardHero";
import AllUsers from "../components/Admin/Users/AllUsers";
import AllCourses from "../components/Admin/Course/AllCourses";
import AllInvoices from "../components/Admin/Order/AllInvoices";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <DashboardHero isDashboard={true} />
      
      <div className="mt-8 grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-[#111c44] rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <AllUsers isTeam={true} />
        </div>
        
        <div className="bg-white dark:bg-[#111c44] rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Courses</h2>
          <AllCourses />
        </div>
        
        <div className="bg-white dark:bg-[#111c44] rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
}
