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

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
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

const AdminSidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        collapsed={isCollapsed}
        style={{
          position: "relative", /* Changed to relative since parent is now fixed */
          height: "100vh",
          width: isCollapsed ? "0%" : "100%",
          backgroundColor: theme === "dark" ? "#111C43" : "white",
          border: "none",
          boxShadow: theme === "dark" 
            ? "0 0 10px rgba(0,0,0,0.5)" 
            : "0 0 10px rgba(0,0,0,0.1)",
        }}
        className="!border-r-0"
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
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{
              margin: "30px 0 26px 0", // Increased top margin for better spacing
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <span className="block">
                  <h3 className="text-[22px] font-bold uppercase dark:text-white text-black">
                    ThinkCyber
                  </h3>
                </span>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block hover:bg-gray-100 dark:hover:bg-[#1e2a47]"
                >
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User profile section removed */}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
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
              {!isCollapsed && "Data"}
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
              {!isCollapsed && "Content"}
            </Typography>
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
              {!isCollapsed && "Customization"}
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
              {!isCollapsed && "Controllers"}
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
              {!isCollapsed && "Analytics"}
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

            <Typography
              variant="h6"
              className="!text-[14px] text-gray-500 dark:text-[#ffffffc1] uppercase !font-semibold tracking-wider"
              sx={{ m: "24px 0 10px 25px" }}
            >
              {!isCollapsed && "Account"}
            </Typography>
            <div onClick={logoutHandler}>
              <MenuItem
                active={false}
                icon={<ExitToAppIcon className="text-red-500" />}
                className="hover:!bg-[#f0f0f0] dark:hover:!bg-[#1e2a47] transition-all duration-200 my-1"
                style={{
                  borderRadius: "8px",
                  marginLeft: isCollapsed ? undefined : "10%",
                  marginRight: "10%",
                }}
              >
                <Typography className="!text-[15px] !font-medium text-red-500">
                  Logout
                </Typography>
              </MenuItem>
            </div>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AdminSidebar;
