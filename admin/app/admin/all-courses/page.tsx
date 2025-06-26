import { DataTable } from "@/app/components/Admin/DataTable/DataTable"
import { SectionCards } from "@/app/components/SectionCard/SectionCard"

const myTableData = [
  {
    header: "HTML",
    id: 1,
    type: "Review",
    status: "Pending",
    target: "Team A",
    limit: "10",
    reviewer: "John Doe",
  },
  {
    header: "CSS",
    id: 2,
    type: "Submission",
    status: "Approved",
    target: "Team B",
    limit: "15",
    reviewer: "Jane Smith",
  },
  {
    header: "JavaScript",
    id: 3,
    type: "Review",
    status: "Pending",
    target: "Team A",
    limit: "10",
    reviewer: "John Doe",
  },
  {
    header: "ReactJS",
    id: 4,
    type: "Submission",
    status: "Approved",
    target: "Team B",
    limit: "15",
    reviewer: "Jane Smith",
  },
  {
    header: "ReactNative",
    id: 5,
    type: "Review",
    status: "Pending",
    target: "Team A",
    limit: "10",
    reviewer: "John Doe",
  },
  {
    header: "NodeJS",
    id: 6,
    type: "Submission",
    status: "Approved",
    target: "Team B",
    limit: "15",
    reviewer: "Jane Smith",
  },
  {
    header: "GraphQL",
    id: 7,
    type: "Review",
    status: "Pending",
    target: "Team A",
    limit: "10",
    reviewer: "John Doe",
  },
  {
    header: "MongoDB",
    id: 8,
    type: "Submission",
    status: "Approved",
    target: "Team B",
    limit: "15",
    reviewer: "Jane Smith",
  },
  {
    header: "Q1 Analysis",
    id: 9,
    type: "Review",
    status: "Pending",
    target: "Team A",
    limit: "10",
    reviewer: "John Doe",
  },
  {
    header: "Q2 Report",
    id: 10,
    type: "Submission",
    status: "Approved",
    target: "Team B",
    limit: "15",
    reviewer: "Jane Smith",
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