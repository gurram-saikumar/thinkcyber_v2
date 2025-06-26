"use client";
import React, { useState } from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import AdminHeader from "@/app/components/Admin/Header/AdminHeader";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(true); // Controls sidebar

  return (
  <div className="flex min-h-screen bg-[#f5f5f9] dark:bg-[#0f172a]">
  <aside className="fixed top-0 left-0 h-screen z-50">
    <AdminSidebar open={open} setOpen={setOpen} />
  </aside>

  <div className={`flex flex-col w-full transition-all duration-300 ease-in-out ${open ? "ml-[240px]" : "ml-[80px] md:ml-[80px]"}
`}>
    <header className="sticky top-0 z-40">
      <AdminHeader open={open} setOpen={setOpen} />
    </header>

    <main className="px-4 pt-6">
      {children}
    </main>
  </div>
</div>
  );
};

export default AdminLayout;


