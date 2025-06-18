'use client'
import React from 'react'
import AllInvoices from "../../../app/components/Admin/Order/AllInvoices";
import { Box, Typography } from "@mui/material";

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="p-4">
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Invoices Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all orders and invoices
        </Typography>
      </Box>
      <AllInvoices />
    </div>
  )
}

export default Page