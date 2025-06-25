"use client";
import { FC, useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  ExitToAppIcon,
  LayersOutlined,
} from "./Icon";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}


const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected, }) => {
  const router = useRouter();
  const isActive = selected === title;


  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        setSelected(title);
        router.push(to);
      }}
    >
      <MenuItem
        active={isActive}
        icon={icon}
        className="hover:!bg-[#f0f0f0] dark:hover:!bg-[#1e2a47] transition-all duration-200 my-1"
        style={{
          borderRadius: "8px",
        }}
      >
        <Typography className="!text-[15px] !font-medium text-black dark:text-white">
          {title}
        </Typography>
      </MenuItem>
    </div>
  );
};

interface AdminSidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, setOpen }) => {
  const { user } = useSelector((state: any) => state.auth);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    // Set selected based on pathname
    if (pathname === "/admin") {
      setSelected("Dashboard");
    } else if (pathname === "/admin/users") {
      setSelected("Users");
    } else if (pathname === "/admin/invoices") {
      setSelected("Invoices");
    } else if (pathname === "/admin/create-course") {
      setSelected("Create Course");
    } else if (pathname === "/admin/courses") {
      setSelected("Live Courses");
    } else if (pathname === "/admin/hero") {
      setSelected("Hero");
    } else if (pathname === "/admin/faq") {
      setSelected("FAQ");
    } else if (pathname === "/admin/categories") {
      setSelected("Categories");
    } else if (pathname === "/admin/subcategories") {
      setSelected("Subcategories");
    } else if (pathname === "/admin/team") {
      setSelected("Manage Team");
    } else if (pathname === "/admin/courses-analytics") {
      setSelected("Courses Analytics");
    } else if (pathname === "/admin/orders-analytics") {
      setSelected("Orders Analytics");
    } else if (pathname === "/admin/users-analytics") {
      setSelected("Users Analytics");
    }
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.reload();
  };

  return (
    <Box
      sx={{
        "& .ps-sidebar-root": {
          border: "none !important",
        },
        "& .ps-menu-button": {
          padding: "8px 16px !important",
        },
        "& .ps-menu-button:hover": {
          backgroundColor: theme === "dark" ? "#1e2a47 !important" : "#f0f0f0 !important",
        },
        "& .ps-menu-button.ps-active": {
          backgroundColor: theme === "dark" ? "#1e2a47 !important" : "#f0f0f0 !important",
          borderRight: "4px solid #3ccba0 !important",
        }
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <Sidebar
        collapsed={!open} 
        // className="!border-r-0"
        style={{
          // position: "relative",
          height: "100vh",
          width: open ? "16vw" : "80px",
          transition: "all 0.3s ease-in-out",
          backgroundColor: theme === "dark" ? "#111C43" : "white",
          boxShadow:
          theme === "dark"
            ? "0 0 10px rgba(0,0,0,0.5)"
            : "0 0 10px rgba(0,0,0,0.1)",
         
        }}
      >
        <Menu
          menuItemStyles={{
            button: {
              "&:hover": {
                backgroundColor: theme === "dark" ? "#1e2a47" : "#f0f0f0",
              },
            },
          }}
        >
          {/* Sidebar Toggle Button */}
          <MenuItem
            onClick={() => setOpen(!open)}
            icon={
              open ? (
                <ArrowBackIosIcon className="text-black dark:text-white" />
              ) : (
                <ArrowForwardIosIcon className="text-black dark:text-white" />
              )
            }
            style={{ margin: "30px 0 26px 0" }}
          >
            {open && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="10px"
              >
                <h3 className="text-[22px] font-bold uppercase dark:text-white text-black">
                  ThinkCyber
                </h3>
              </Box>
            )}
          </MenuItem>

          {/* Sidebar Content */}
          <Box paddingLeft={open ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              sx={{ m: "24px 0 10px 25px" }}
              className="!text-[14px] text-gray-500 dark:text-[#ffffffc1] uppercase !font-semibold tracking-wider"
            >
              {open && "Data"}
            </Typography>

            <Item
              title="Users"
              to="/admin/users"
              icon={<GroupsIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={
                <ReceiptOutlinedIcon className="text-black dark:text-white" />
              }
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[14px] text-gray-500 dark:text-[#ffffffc1] uppercase !font-semibold tracking-wider"
              sx={{ m: "24px 0 10px 25px" }}
            >
              {open && "Content"}
            </Typography>
            <Item
              title="All Course"
              to="/admin/all-courses"
              icon={<LayersOutlined className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<VideoCallIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={
                <OndemandVideoIcon className="text-black dark:text-white" />
              }
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[14px] text-gray-500 dark:text-[#ffffffc1] uppercase !font-semibold tracking-wider"
              sx={{ m: "24px 0 10px 25px" }}
            >
              {open && "Customization"}
            </Typography>
            <Item
              title="Hero"
              to="/admin/hero"
              icon={<WebIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<QuizIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/admin/categories"
              icon={<WysiwygIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Subcategories"
              to="/admin/subcategories"
              icon={<WysiwygIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[14px] text-gray-500 dark:text-[#ffffffc1] uppercase !font-semibold tracking-wider"
              sx={{ m: "24px 0 10px 25px" }}
            >
              {open && "Controllers"}
            </Typography>
            <Item
              title="Manage Team"
              to="/admin/team"
              icon={
                <PeopleOutlinedIcon className="text-black dark:text-white" />
              }
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[14px] text-gray-500 dark:text-[#ffffffc1] uppercase !font-semibold tracking-wider"
              sx={{ m: "24px 0 10px 25px" }}
            >
              {open && "Analytics"}
            </Typography>
            <Item
              title="Courses Analytics"
              to="/admin/courses-analytics"
              icon={
                <BarChartOutlinedIcon className="text-black dark:text-white" />
              }
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to="/admin/orders-analytics"
              icon={<MapOutlinedIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Users Analytics"
              to="/admin/users-analytics"
              icon={
                <ManageHistoryIcon className="text-black dark:text-white" />
              }
              selected={selected}
              setSelected={setSelected}
            />

          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AdminSidebar;
