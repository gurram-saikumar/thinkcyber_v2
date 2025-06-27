// import React, { useEffect, useState } from "react";
// import { GridColDef } from "@mui/x-data-grid";
// import { Box, Chip, IconButton, Tooltip } from "@mui/material";
// import { useTheme } from "next-themes";
// import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
// import Loader from "../../Loader/Loader";
// import { format } from "timeago.js";
// import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
// import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
// import { AiOutlineMail } from "react-icons/ai";
// import ModernTable from "../Table/ModernTable";

// type Props = {
//   isDashboard?: boolean;
// };

// const AllInvoices = ({ isDashboard }: Props) => {
//   const { theme, setTheme } = useTheme();
//   const { isLoading, data } = useGetAllOrdersQuery({});
//   const { data: usersData } = useGetAllUsersQuery({});
//   const { data: coursesData } = useGetAllCoursesQuery({});

//   const [orderData, setOrderData] = useState<any>([]);

//   useEffect(() => {
//     if (data) {
//       const temp = data.orders.map((item: any) => {
//         const user = usersData?.users.find(
//           (user: any) => user._id === item.userId
//         );
//         const course = coursesData?.courses.find(
//           (course: any) => course._id === item.courseId
//         );
//         return {
//           ...item,
//           userName: user?.name,
//           userEmail: user?.email,
//           title: course?.name,
//           price: "$" + course?.price,
//         };
//       });
//       setOrderData(temp);
//     }
//   }, [data, usersData, coursesData]);

//   const columns: GridColDef[] = [
//     { 
//       field: "id", 
//       headerName: "Order ID", 
//       flex: 0.3,
//       minWidth: 100,
//       renderCell: (params: any) => (
//         <Tooltip title={params.value}>
//           <span className="font-medium">
//             {String(params.value).slice(0, 8)}...
//           </span>
//         </Tooltip>
//       )
//     },
//     { 
//       field: "userName", 
//       headerName: "Customer", 
//       flex: isDashboard ? 0.6 : 0.5,
//       minWidth: 120,
//       renderCell: (params: any) => (
//         <span className="font-medium">{params.value}</span>
//       )
//     },
//     ...(isDashboard
//       ? []
//       : [
//           { 
//             field: "userEmail", 
//             headerName: "Email", 
//             flex: 1,
//             minWidth: 180,
//             renderCell: (params: any) => (
//               <span className="text-sm">{params.value}</span>
//             )
//           },
//           { 
//             field: "title", 
//             headerName: "Course Title", 
//             flex: 1,
//             minWidth: 180,
//             renderCell: (params: any) => (
//               <Tooltip title={params.value}>
//                 <span className="font-medium">
//                   {params.value && params.value.length > 30
//                     ? `${params.value.slice(0, 30)}...`
//                     : params.value}
//                 </span>
//               </Tooltip>
//             )
//           },
//         ]),
//     { 
//       field: "price", 
//       headerName: "Price", 
//       flex: 0.5,
//       minWidth: 80,
//       renderCell: (params: any) => (
//         <Chip 
//           label={params.value} 
//           color="success" 
//           variant="outlined" 
//           size="small"
//         />
//       )
//     },
//     ...(isDashboard
//       ? [
//           { 
//             field: "created_at", 
//             headerName: "Purchased", 
//             flex: 0.5,
//             minWidth: 100,
//             renderCell: (params: any) => (
//               <span className="text-sm">{params.value}</span>
//             )
//           }
//         ]
//       : [
//           {
//             field: "email_action",
//             headerName: "Contact",
//             flex: 0.3,
//             minWidth: 60,
//             sortable: false,
//             filterable: false,
//             disableColumnMenu: true,
//             renderCell: (params: any) => {
//               return (
//                 <Tooltip title={`Email ${params.row.userName}`}>
//                   <IconButton 
//                     color="primary"
//                     href={`mailto:${params.row.userEmail}`}
//                     size="small"
//                   >
//                     <AiOutlineMail size={18} />
//                   </IconButton>
//                 </Tooltip>
//               );
//             },
//           },
//         ]),
//   ];

//   const rows: any = [];

//   orderData &&
//     orderData.forEach((item: any) => {
//       rows.push({
//         id:item._id || item.name || `${item.title}-${item.created_at}`,
//         userName: item.userName,
//         userEmail: item.userEmail,
//         title: item.title,
//         price: item.price,
//         created_at: format(item.createdAt),
//       });
//     });

//   return (
//     <div className="w-full">
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <Box>
//           <Box
//             height={isDashboard ? "35vh" : "70vh"}
//             overflow={"hidden"}
//           >
//             <ModernTable
//               rows={rows}
//               columns={columns}
//               loading={isLoading}
//               isDashboard={isDashboard}
//               enableSelection={!isDashboard}
//               enableToolbar={!isDashboard}
//               enablePagination={true}
//               pageSize={10}
//               height={isDashboard ? "35vh" : "70vh"}
//             />
//           </Box>
//         </Box>
//       )}
//     </div>
//   );
// };

// export default AllInvoices;


"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ReusableDataTable, BaseTableItem, TableAction, ColumnConfig } from "@/app/components/Admin/DataTable/DataTable"


interface AllInvoices extends BaseTableItem {
  id: number
  header: string
  price: number
}

const courseColumns: ColumnConfig<AllInvoices>[] = [
 
  {
    key: "header",
    header: "Order ID ",
    type: "custom",
    enableHiding: false,
    render: (item: AllInvoices) => (
      <Button variant="link" className="text-foreground w-fit px-0 text-left">
        {item.header}
      </Button>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    type: "custom",
  },
  {
    key: "purchase",
    header: "Purchase",
    type: "select",
    selectPlaceholder: "Assign reviewer",
    selectOptions: [
      { value: "Pending", label: "Pending" },
      { value: "DOne", label: "Done" },
    ],
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

export const invoicesData: AllInvoices[] = [
  {
    id: 1,
    header: "ORD-1001",
    customer: "Alice Johnson",
    price: 299,
  },
  {
    id: 2,
    header: "ORD-1002",
    customer: "Bob Smith",
    price: 450,
  },
  {
    id: 3,
    header: "ORD-1003",
    customer: "Charlie Davis",
    price: 199,
  },
  {
    id: 4,
    header: "ORD-1004",
    customer: "Diana Evans",
    price: 349,
  },
  {
    id: 5,
    header: "ORD-1005",
    customer: "Edward Harris",
    price: 275,
  },
]


export default function AllInvoices() {
  const handleActionClick = (action: string, item: AllInvoices) => {
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
    <div className="p-6 dark:bg-black rounded-xl shadow-md">
      <ReusableDataTable
        data={invoicesData}
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

