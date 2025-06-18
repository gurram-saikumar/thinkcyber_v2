import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";
import ModernTable from "../Table/ModernTable";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme, setTheme } = useTheme();
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );
        const course = coursesData?.courses.find(
          (course: any) => course._id === item.courseId
        );
        return {
          ...item,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "$" + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: GridColDef[] = [
    { 
      field: "id", 
      headerName: "Order ID", 
      flex: 0.3,
      minWidth: 100,
      renderCell: (params: any) => (
        <Tooltip title={params.value}>
          <span className="font-medium">
            {String(params.value).slice(0, 8)}...
          </span>
        </Tooltip>
      )
    },
    { 
      field: "userName", 
      headerName: "Customer", 
      flex: isDashboard ? 0.6 : 0.5,
      minWidth: 120,
      renderCell: (params: any) => (
        <span className="font-medium">{params.value}</span>
      )
    },
    ...(isDashboard
      ? []
      : [
          { 
            field: "userEmail", 
            headerName: "Email", 
            flex: 1,
            minWidth: 180,
            renderCell: (params: any) => (
              <span className="text-sm">{params.value}</span>
            )
          },
          { 
            field: "title", 
            headerName: "Course Title", 
            flex: 1,
            minWidth: 180,
            renderCell: (params: any) => (
              <Tooltip title={params.value}>
                <span className="font-medium">
                  {params.value && params.value.length > 30
                    ? `${params.value.slice(0, 30)}...`
                    : params.value}
                </span>
              </Tooltip>
            )
          },
        ]),
    { 
      field: "price", 
      headerName: "Price", 
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: any) => (
        <Chip 
          label={params.value} 
          color="success" 
          variant="outlined" 
          size="small"
        />
      )
    },
    ...(isDashboard
      ? [
          { 
            field: "created_at", 
            headerName: "Purchased", 
            flex: 0.5,
            minWidth: 100,
            renderCell: (params: any) => (
              <span className="text-sm">{params.value}</span>
            )
          }
        ]
      : [
          {
            field: "email_action",
            headerName: "Contact",
            flex: 0.3,
            minWidth: 60,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: any) => {
              return (
                <Tooltip title={`Email ${params.row.userName}`}>
                  <IconButton 
                    color="primary"
                    href={`mailto:${params.row.userEmail}`}
                    size="small"
                  >
                    <AiOutlineMail size={18} />
                  </IconButton>
                </Tooltip>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  orderData &&
    orderData.forEach((item: any) => {
      rows.push({
        id:item._id || item.name || `${item.title}-${item.created_at}`,
        userName: item.userName,
        userEmail: item.userEmail,
        title: item.title,
        price: item.price,
        created_at: format(item.createdAt),
      });
    });

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <Box
            height={isDashboard ? "35vh" : "70vh"}
            overflow={"hidden"}
          >
            <ModernTable
              rows={rows}
              columns={columns}
              loading={isLoading}
              isDashboard={isDashboard}
              enableSelection={!isDashboard}
              enableToolbar={!isDashboard}
              enablePagination={true}
              pageSize={10}
              height={isDashboard ? "35vh" : "70vh"}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
