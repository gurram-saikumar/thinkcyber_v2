import { DataTable } from "@/app/components/Admin/DataTable/DataTable"
import { SectionCards } from "@/app/components/SectionCard/SectionCard"

const myTableData = [
  {
    header: "Q1 Analysis",
    id: 1,
    type: "Review",
    status: "Pending",
    target: "Team A",
    limit: "10",
    reviewer: "John Doe",
  },
  {
    header: "Q2 Report",
    id: 2,
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