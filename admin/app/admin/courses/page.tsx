'use client'
import React from 'react'
import AllCourses from "../../components/Admin/Course/AllCourses";
import { Box, Typography } from "@mui/material";

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="p-4">
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Courses Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all courses and their content
        </Typography>
      </Box>
      <AllCourses />
    </div>
  )
}

export default Page