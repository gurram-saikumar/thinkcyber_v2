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
  const [open, setOpen] = useState(false); // Controls the notification
  const [Sidebaropen, Sidebarsetopen] = useState(true); // Controls sidebar

  return (
  <div className="flex min-h-screen">
  <aside className="fixed top-0 left-0 h-screen z-50">
    <AdminSidebar Sidebaropen={Sidebaropen} SidebarsetOpen={Sidebarsetopen} />
  </aside>

  <div className={`flex flex-col w-full transition-all duration-300 ease-in-out ${Sidebaropen ? "ml-[240px]" : "ml-[80px] md:ml-[80px]"}
`}>
    <header className="sticky top-0 z-40">
      <AdminHeader open={open} setOpen={setOpen} />
    </header>

    <main className="px-4 pt-3">
      {children}
    </main>
  </div>
</div>
  );
};

export default AdminLayout;