'use client'
import React from 'react'
import EditHero from "@/app/components/Admin/Customization/EditHero";

type Props = {}

const page = (props: Props) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-5">
      <div className="border-l-4 border-blue-500 pl-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          Hero Section Management
        </h1>
      </div>
      <EditHero />
    </div>
  );
};

export default page;