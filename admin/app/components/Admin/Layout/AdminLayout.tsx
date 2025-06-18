"use client";
import React from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import AdminHeader from "@/app/components/Admin/Header/AdminHeader";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);  return (
    <div className="flex h-screen bg-[#f5f5f9] dark:bg-[#0f172a]">
      {/* Sidebar with highest z-index */}
      <aside className="w-[80px] md:w-[16%] fixed h-screen top-0 left-0 z-50">
        <AdminSidebar />
      </aside>
      
      {/* Main content area with header and content */}
      <div className="w-full md:ml-[16%] ml-[80px] flex flex-col">
        <header className="sticky top-0 z-40">
          <AdminHeader open={open} setOpen={setOpen} />
        </header>
        
        <main className="flex-grow overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
