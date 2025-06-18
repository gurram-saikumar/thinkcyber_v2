import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal, Tooltip, IconButton, Chip } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ModernTable from "../Table/ModernTable";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});
  const columns: GridColDef[] = [
    { 
      field: "id", 
      headerName: "ID", 
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: any) => (
        <Tooltip title={params.value}>
          <span className="font-medium">
            {String(params.value).length > 10 ? `${String(params.value).slice(0, 8)}...` : params.value}
          </span>
        </Tooltip>
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
    { 
      field: "ratings", 
      headerName: "Ratings", 
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: any) => (
        <span className="font-medium">
          {typeof params.value === 'number' ? params.value.toFixed(1) : params.value}
        </span>
      )
    },
    { 
      field: "purchased", 
      headerName: "Purchased", 
      flex: 0.5,
      minWidth: 100,
      renderCell: (params: any) => (
        <Chip 
          label={params.value} 
          color="info" 
          variant="outlined" 
          size="small"
        />
      )
    },
    { 
      field: "created_at", 
      headerName: "Created At", 
      flex: 0.5,
      minWidth: 120,
      renderCell: (params: any) => (
        <span className="text-sm">{params.value}</span>
      )
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      minWidth: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <Tooltip title="Edit Course">
            <IconButton
              color="primary" 
              component={Link}
              href={`/admin/edit-course/${params.row.id}`}
              size="small"
            >
              <FiEdit2 size={18} />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      minWidth: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <Tooltip title="Delete Course">
            <IconButton
              color="error"
              onClick={() => {
                setOpen(!open);
                setCourseId(params.row.id);
              }}
              size="small"
            >
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const rows: any = [];

  {
    data &&
      data.courses.forEach((item: any) => {
        rows.push({
          id: item._id || item.name || `${item.title}-${item.created_at}`,
          title: item.name,
          ratings: item.ratings,
          purchased: item.purchased,
          created_at: format(item.createdAt),
        });
      });
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error,refetch]);

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <Box height="70vh">
            <ModernTable
              rows={rows}
              columns={columns}
              loading={isLoading}
              enableSelection={false}
              enableToolbar={true}
              enablePagination={true}
              pageSize={10}
            />
          </Box>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this course?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
