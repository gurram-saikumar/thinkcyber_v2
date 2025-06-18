'use client'
import React from 'react'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import AllUsers from "../../components/Admin/Users/AllUsers";
import AdminLayout from '@/app/components/Admin/Layout/AdminLayout';

type Props = {}

const Page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="ThinkCyber - Admin Users"
          description="ThinkCyber is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <AdminLayout>
          <AllUsers />
        </AdminLayout>
      </AdminProtected>
    </div>
  )
}

export default Page