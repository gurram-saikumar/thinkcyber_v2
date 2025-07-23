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
        className={`hover:!bg-[#f8f9fa] transition-all duration-200 my-1`}
        style={{
          borderRadius: "0",
          position: "relative",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <Typography className={`!text-[14px] !font-medium ${
          isActive ? "text-gray-900" : "text-gray-600"
        }`}>
          {title}
        </Typography>
      </MenuItem>
    </div>
  );
};

interface AdminSidebarProps {
  Sidebaropen: boolean;
  SidebarsetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ Sidebaropen, SidebarsetOpen }) => {
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
      setSelected("Users List");
    } else if (pathname === "/admin/invoices") {
      setSelected("Invoices");
    } else if (pathname === "/admin/new-topic") {
      setSelected("New Topic");
    } else if (pathname === "/admin/all-topics") {
      setSelected("All Topics");
    } else if (pathname === "/admin/home-page") {
      setSelected("Home Page");
    } else if (pathname === "/admin/info-cards") {
      setSelected("Information Cards");
    } else if (pathname === "/admin/terms") {
      setSelected("Terms and Conditions");
    } else if (pathname === "/admin/privacy") {
      setSelected("Privacy");
    } else if (pathname === "/admin/contact") {
      setSelected("Contact Us");
    } else if (pathname === "/admin/categories") {
      setSelected("Categories");
    } else if (pathname === "/admin/subcategories") {
      setSelected("Sub-Categories");
    } else if (pathname === "/admin/languages") {
      setSelected("Languages");
    } else if (pathname === "/admin/users-analytics") {
      setSelected("User Analytics");
    } else if (pathname === "/admin/earnings") {
      setSelected("Earnings");
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
          backgroundColor: "#f8f9fa !important",
        },
        "& .ps-menu-button.ps-active": {
          backgroundColor: "#f8f9fa !important",
          borderRight: "3px solid #f03e3e !important",
        }
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <Sidebar
        collapsed={!Sidebaropen} 
        style={{
          height: "100vh",
          width: Sidebaropen ? "240px" : "80px",
          transition: "all 0.3s ease-in-out",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "auto"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Menu
            className="custom-scrollbar"
            style={{ 
              flexGrow: 1, 
              overflowY: "auto", 
              marginBottom: "60px",
              scrollbarWidth: "thin",
              scrollbarColor: "#e74c3c transparent"
            }}
            menuItemStyles={{
              button: {
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#1e2a47" : "#f0f0f0",
                },
              },
              icon: {
                color: "#3498db", /* Blue color for all icons */
              },
            }}
          >
            {/* Logo at top */}
            <MenuItem
              style={{ margin: "20px 0 30px 0", padding: "0" }}
              onClick={() => SidebarsetOpen(!Sidebaropen)}
              icon={
                !Sidebaropen ? (
                  <img src="/assests/logo-headd.svg" alt="Icon" className="w-8 h-8" />
                ) : null
              }
            >
              {Sidebaropen && (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <img src="/assests/logo.svg" alt="ThinkCyber Logo" className="h-10 w-auto mr-auto" />
                  <IconButton onClick={() => SidebarsetOpen(!Sidebaropen)}>
                    <ArrowBackIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {/* Sidebar Content */}
            <Box paddingLeft={Sidebaropen ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/admin"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              
              <Typography
                variant="h6"
                sx={{ m: "18px 0 8px 15px" }}
                className="!text-[13px] text-gray-400 dark:text-[#ffffffc1] !font-medium"
              >
                {Sidebaropen && "Topics"}
              </Typography>

              <Item
                title="New Topic"
                to="/admin/new-topic"
                icon={<OndemandVideoIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="All Topics"
                to="/admin/all-topics"
                icon={<LayersOutlined />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                sx={{ m: "18px 0 8px 15px" }}
                className="!text-[13px] text-gray-400 dark:text-[#ffffffc1] !font-medium"
              >
                {Sidebaropen && "Users"}
              </Typography>

              <Item
                title="Users List"
                to="/admin/users"
                icon={<GroupsIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                sx={{ m: "18px 0 8px 15px" }}
                className="!text-[13px] text-gray-400 dark:text-[#ffffffc1] !font-medium"
              >
                {Sidebaropen && "Masters"}
              </Typography>

              <Item
                title="Categories"
                to="/admin/categories"
                icon={<QuizIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Sub-Categories"
                to="/admin/subcategories"
                icon={<QuizIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Languages"
                to="/admin/languages"
                icon={<ManageHistoryIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                sx={{ m: "18px 0 8px 15px" }}
                className="!text-[13px] text-gray-400 dark:text-[#ffffffc1] !font-medium"
              >
                {Sidebaropen && "Frontend"}
              </Typography>

              <Item
                title="Home Page"
                to="/admin/home-page"
                icon={<WebIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Information Cards"
                to="/admin/info-cards"
                icon={<WysiwygIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Terms and Conditions"
                to="/admin/terms"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Privacy"
                to="/admin/privacy"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Contact Us"
                to="/admin/contact"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                sx={{ m: "18px 0 8px 15px" }}
                className="!text-[13px] text-gray-400 dark:text-[#ffffffc1] !font-medium"
              >
                {Sidebaropen && "Reports"}
              </Typography>

              <Item
                title="User Analytics"
                to="/admin/users-analytics"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Earnings"
                to="/admin/earnings"
                icon={<MapOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Invoices"
                to="/admin/invoices"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </div>
        
        {/* Footer Section */}
        <div style={{
          position: "fixed",
          bottom: 0,
          width: Sidebaropen ? "240px" : "80px",
          backgroundColor: "#008FE8",
          transition: "width 0.3s ease-in-out",
          zIndex: 10,
          display: "flex",
          flexDirection: Sidebaropen ? "row" : "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px"
        }}>
          {Sidebaropen && (
            <Typography 
              variant="caption" 
              className="text-white text-[9px]"
            >
              © 2025 All Rights @ThinkCyber
            </Typography>
          )}
          
           
        </div>
      </Sidebar>
    </Box>
  );
};

export default AdminSidebar;