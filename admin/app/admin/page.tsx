"use client";
import React from "react";
import DashboardHero from "../components/Admin/DashboardHero";
import { Box, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <div className="p-4"> 
      <DashboardHero isDashboard={true} />
    </div>
  );
}
