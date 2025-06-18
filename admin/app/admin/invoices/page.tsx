'use client'
import React from 'react'
import Heading from '../../../app/utils/Heading';
import AllInvoices from "../../../app/components/Admin/Order/AllInvoices";
import AdminLayout from '@/app/components/Admin/Layout/AdminLayout';
import AdminProtected from '@/app/hooks/adminProtected';

type Props = {}

const Page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="ThinkCyber - Admin Invoices"
          description="ThinkCyber is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <AdminLayout>
          <AllInvoices />
        </AdminLayout>
      </AdminProtected>
    </div>
  )
}

export default Page