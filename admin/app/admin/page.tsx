"use client";
import React from "react";
import DashboardHero from "../components/Admin/DashboardHero";
import { Box, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <div className="p-4">
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the ThinkCyber admin dashboard
        </Typography>
      </Box>
      <DashboardHero isDashboard={true} />
    </div>
  );
}
