import React, { FC, useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal, Tooltip, IconButton, Chip } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import ModernTable from "../Table/ModernTable";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Delete user successfully!");
      setOpen(false);
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [updateError, isSuccess, deleteSuccess, deleteError]);

  const columns: GridColDef[] = [
    { 
      field: "id", 
      headerName: "ID", 
      flex: 0.3,
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
      field: "name", 
      headerName: "Name", 
      flex: 0.5,
      minWidth: 120,
      renderCell: (params: any) => (
        <span className="font-medium">{params.value}</span>
      )
    },
    { 
      field: "email", 
      headerName: "Email", 
      flex: 0.5,
      minWidth: 180,
      renderCell: (params: any) => (
        <span className="text-sm">{params.value}</span>
      )
    },
    { 
      field: "role", 
      headerName: "Role", 
      flex: 0.5,
      minWidth: 100,
      renderCell: (params: any) => (
        <Chip 
          label={params.value} 
          color={params.value === "admin" ? "primary" : "default"} 
          variant="outlined" 
          size="small"
        />
      )
    },
    { 
      field: "courses", 
      headerName: "Purchased Courses", 
      flex: 0.5,
      minWidth: 150,
      renderCell: (params: any) => (
        <span className="font-medium">{params.value}</span>
      )
    },
    { 
      field: "created_at", 
      headerName: "Joined At", 
      flex: 0.5,
      minWidth: 120,
      renderCell: (params: any) => (
        <span className="text-sm">{params.value}</span>
      )
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
          <Tooltip title="Delete User">
            <IconButton
              color="error"
              onClick={() => {
                setOpen(!open);
                setUserId(params.row.id);
              }}
              size="small"
            >
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "email_action",
      headerName: "Email",
      flex: 0.2,
      minWidth: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <Tooltip title={`Email ${params.row.name}`}>
            <IconButton 
              color="primary"
              href={`mailto:${params.row.email}`}
              size="small"
            >
              <AiOutlineMail size={18} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const rows: any = [];

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id || item.email || `${item.name}-${item.email}`,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: Array.isArray(item.courses) ? item.courses.length : 0,
          created_at: format(item.createdAt),
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id || item.email || `${item.name}-${item.email}`,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: Array.isArray(item.courses) ? item.courses.length : 0,
          created_at: format(item.createdAt),
        });
      });
  }

  const handleSubmit = async () => {
    await updateUserRole({ email, role });
  };

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {isTeam && (
            <div className="w-full flex justify-end mb-5">
              <div
                className={`${styles.button} !w-[200px] !rounded-[10px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </div>
            </div>
          )}
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
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    className={`${styles.input} !mt-6`}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <br />
                  <div
                    className={`${styles.button} my-6 !h-[30px]`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
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

export default AllUsers;
