'use client'
import React from 'react'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import AllCourses from "../../components/Admin/Course/AllCourses";
import AdminLayout from '@/app/components/Admin/Layout/AdminLayout';

type Props = {}

const Page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="ThinkCyber - Admin Courses"
          description="ThinkCyber is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <AdminLayout>
          <AllCourses />
        </AdminLayout>
      </AdminProtected>
    </div>
  )
}

export default Page