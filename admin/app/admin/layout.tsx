"use client";
import React from "react";
import AdminLayout from "@/app/components/Admin/Layout/AdminLayout";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtected>
      <Heading
        title="ThinkCyber - Admin Dashboard"
        description="ThinkCyber Admin Dashboard"
        keywords="admin, dashboard, courses, analytics"
      />
      <AdminLayout>{children}</AdminLayout>
    </AdminProtected>
  );
}
