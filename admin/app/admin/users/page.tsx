'use client'
import React from 'react'
import AllUsers from "../../components/Admin/Users/AllUsers";
import { Box, Typography } from "@mui/material";

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="p-4">
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Users Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all registered users and their roles
        </Typography>
      </Box>
      <AllUsers />
    </div>
  )
}

export default Page