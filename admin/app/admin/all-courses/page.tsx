import { DataTable } from "@/app/components/Admin/DataTable/DataTable"
import { SectionCards } from "@/app/components/SectionCard/SectionCard"

const myTableData = [
  {
    id: 1,
    header: "Building Scalable APIs with GraphQL",
    reviewer: "Lori Stevens",
    date: "28 Oct 2021",
    type: "Beginner",
    price: 350,
    status: "Done",
  },
  {
    id: 2,
    header: "Bootstrap 5 From Scratch",
    reviewer: "Billy Vasquez",
    date: "16 Oct 2021",
    type: "Intermediate",
    price: 256,
    status: "Pending",
  },
  {
    id: 3,
    header: "Modern JavaScript Essentials",
    reviewer: "Jane Smith",
    date: "10 Nov 2021",
    type: "Beginner",
    price: 299,
    status: "Done",
  },
  {
    id: 4,
    header: "Advanced React Patterns",
    reviewer: "John Doe",
    date: "22 Nov 2021",
    type: "Advanced",
    price: 400,
    status: "Pending",
  },
  {
    id: 5,
    header: "Node.js for Backend Development",
    reviewer: "Emily Carter",
    date: "05 Dec 2021",
    type: "Intermediate",
    price: 320,
    status: "Done",
  },
  {
    id: 6,
    header: "Intro to HTML & CSS",
    reviewer: "Michael Lee",
    date: "12 Dec 2021",
    type: "Beginner",
    price: 150,
    status: "Pending",
  },
  {
    id: 7,
    header: "Full-Stack MERN Project",
    reviewer: "Olivia Brown",
    date: "20 Dec 2021",
    type: "Advanced",
    price: 450,
    status: "Done",
  },
  {
    id: 8,
    header: "RESTful API Design",
    reviewer: "Daniel Wilson",
    date: "03 Jan 2022",
    type: "Intermediate",
    price: 275,
    status: "Pending",
  },
  {
    id: 9,
    header: "UX/UI Fundamentals",
    reviewer: "Sophia Martinez",
    date: "10 Jan 2022",
    type: "Beginner",
    price: 200,
    status: "Done",
  },
  {
    id: 10,
    header: "DevOps Essentials",
    reviewer: "William Johnson",
    date: "18 Jan 2022",
    type: "Intermediate",
    price: 300,
    status: "Pending",
  },
];


export default function Page() {
  return (
    <div>
      <SectionCards />
      <DataTable data={myTableData} />
    </div>
  )
}