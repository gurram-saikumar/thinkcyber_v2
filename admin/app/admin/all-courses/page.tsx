"use client"

import React from "react"
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ReusableDataTable, BaseTableItem, TableAction, ColumnConfig } from "@/app/components/Admin/DataTable/DataTable"
import { SectionCards } from "@/app/components/SectionCard/SectionCard"

interface Course extends BaseTableItem {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
  date: string
  price: number
}

const courseColumns: ColumnConfig<Course>[] = [
 
  {
    key: "header",
    header: "Course Name",
    type: "custom",
    enableHiding: false,
    render: (item: Course) => (
      <Button variant="link" className="text-foreground w-fit px-0 text-left">
        {item.header}
      </Button>
    ),
  },
  {
    key: "reviewer",
    header: "Instructor",
    type: "select",
    selectPlaceholder: "Assign reviewer",
    selectOptions: [
      { value: "Eddie Lake", label: "Eddie Lake" },
      { value: "Jamik Tashpulatov", label: "Jamik Tashpulatov" },
    ],
  },
  {
    key: "date",
    header: "Added Date",
    type: "date",
  },
  {
    key: "status",
    header: "Status",
    type: "badge",
    badgeConditions: [
      {
        condition: (value) => value === "Done",
        variant: "default",
        icon: <IconCircleCheckFilled className="w-4 h-4 fill-green-500 dark:fill-green-400" />,
      },
      {
        condition: (value) => value !== "Done",
        variant: "outline",
        icon: <IconLoader className="w-4 h-4" />,
      },
    ],
  },
  {
    key: "type",
    header: "Type",
    type: "text",
    enableHiding: false,
  },
  {
    key: "price",
    header: "Price",
    type: "price",
  },
]

const courseActions: TableAction[] = [
  { label: "Edit", action: "edit" },
  { label: "Make a copy", action: "copy" },
  { label: "Favorite", action: "favorite" },
  { label: "Delete", action: "delete", variant: "destructive" },
]

const coursesData: Course[] = [
  {
    id: 1,
    header: "React Fundamentals",
    type: "Technical Approach",
    status: "Done",
    target: "100 students",
    limit: "50 hours",
    reviewer: "Eddie Lake",
    date: "2024-01-15",
    price: 299,
  },
  {
    id: 2,
    header: "Advanced TypeScript",
    type: "Executive Summary",
    status: "In Progress",
    target: "75 students",
    limit: "40 hours",
    reviewer: "Assign reviewer",
    date: "2024-02-10",
    price: 399,
  },
  {
    id: 3,
    header: "Node.js Backend Development",
    type: "Design",
    status: "Not Started",
    target: "120 students",
    limit: "60 hours",
    reviewer: "Jamik Tashpulatov",
    date: "2024-03-05",
    price: 499,
  },
  {
    id: 4,
    header: "Advanced React Patterns",
    reviewer: "John Doe",
    date: "22 Nov 2021",
    type: "Advanced",
    price: 400,
    status: "Pending",
    target: "120 students",
    limit: "60 hours",
  },
  {
    id: 5,
    header: "Node.js for Backend Development",
    reviewer: "Emily Carter",
    date: "05 Dec 2021",
    type: "Intermediate",
    price: 320,
    status: "Done",
    target: "120 students",
    limit: "60 hours",
  },
  {
    id: 6,
    header: "Intro to HTML & CSS",
    reviewer: "Michael Lee",
    date: "12 Dec 2021",
    type: "Beginner",
    price: 150,
    status: "Pending",
    target: "120 students",
    limit: "60 hours",
  },
  {
    id: 7,
    header: "Full-Stack MERN Project",
    reviewer: "Olivia Brown",
    date: "20 Dec 2021",
    type: "Advanced",
    price: 450,
    status: "Done",
    target: "120 students",
    limit: "60 hours",
  },
  {
    id: 8,
    header: "RESTful API Design",
    reviewer: "Daniel Wilson",
    date: "03 Jan 2022",
    type: "Intermediate",
    price: 275,
    status: "Pending",
    target: "120 students",
    limit: "60 hours",
  },
  {
    id: 9,
    header: "UX/UI Fundamentals",
    reviewer: "Sophia Martinez",
    date: "10 Jan 2022",
    type: "Beginner",
    price: 200,
    status: "Done",
    target: "120 students",
    limit: "60 hours",
  },
  {
    id: 10,
    header: "DevOps Essentials",
    reviewer: "William Johnson",
    date: "18 Jan 2022",
    type: "Intermediate",
    price: 300,
    status: "Pending",
    target: "120 students",
    limit: "60 hours",
  },
]

export default function CoursesPage() {
  const handleActionClick = (action: string, item: Course) => {
    switch (action) {
      case "edit":
        console.log("Edit course:", item)
        break
      case "copy":
        console.log("Copy course:", item)
        break
      case "favorite":
        console.log("Favorite course:", item)
        break
      case "delete":
        console.log("Delete course:", item)
        break
    }
  }

  return (
    <div className="p-6">
      <SectionCards />
      <ReusableDataTable
        data={coursesData}
        columns={courseColumns}
        customActions={courseActions}
        addButtonLabel="Add Course"
        onAddClick={() => console.log("Add new course")}
        onRowClick={(course) => console.log("Course clicked:", course)}
        onDataChange={(newData) => console.log("Courses reordered:", newData)}
        onActionClick={handleActionClick}
      />
    </div>
  )
}

