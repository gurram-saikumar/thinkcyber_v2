"use client";
import React, { useState, useEffect, useRef } from "react";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import { useSelector } from "react-redux";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { format } from "timeago.js";
import Cookies from "js-cookie";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open: boolean; // notification panel
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminHeader: React.FC<Props> = ({ open, setOpen }) => {
  const { user } = useSelector((state: any) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();

  const [notifications, setNotifications] = useState<any>([]);
  const [audio] = useState<any>(
    typeof window !== "undefined" &&
    new Audio(
      "https://res.cloudinary.com/dkg6jv4l0/video/upload/v1716750964/notification_jvwqd0.mp3"
    )
  );

  const playNotificationSound = () => {
    audio.play();
  };

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
    audio.load();
  }, [data, isSuccess, audio]);

  useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
      playNotificationSound();
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  const logoutHandler = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.reload();
  };
  return (
  <div className="w-full flex items-center justify-between p-6 bg-white/95 dark:bg-[#111C43]/95 backdrop-blur-sm shadow-sm">
    <h1 className="text-2xl font-bold text-black dark:text-white hidden md:block">Dashboard</h1>
    
    <div className="flex items-center gap-4">
      <ThemeSwitcher />

      <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        {notifications && notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px]    flex items-center justify-center text-white">
            {notifications.length}
          </span>
        )}
      </div>
      
      <div className="relative" ref={userMenuRef}>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          {user?.avatar ? (
            <img
              src={user.avatar.url}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#3ccba0]"
            />
          ) : (
            <IoPersonCircleOutline className="text-3xl dark:text-white text-black" />
          )}
          <span className="hidden md:block text-black dark:text-white font-medium">
            {user?.name || "Admin"}
          </span>
        </div>

        {showUserMenu && (
          <div className="absolute right-0 top-12 w-48 bg-white dark:bg-[#111C43] shadow-lg rounded-md py-2 z-10">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-black dark:text-white">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ""}</p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-[#1e2a47] cursor-pointer"
              onClick={logoutHandler}
            >
              <MdOutlineLogout className="text-lg" />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>

    {open && (
      <div className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 right-4 z-[1000] rounded-md">
        <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
          Notifications
        </h5>
        {notifications && notifications.length > 0 ? (
          notifications.map((item: any, index: number) => (
            <div
              className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] rounded-md mb-2"
              key={index}
            >
              <div className="w-full flex items-center justify-between p-2">
                <p className="text-black dark:text-white">{item.title}</p>
                <p
                  className="text-[#3ccba0] cursor-pointer text-sm"
                  onClick={() => handleNotificationStatusChange(item._id)}
                >
                  Mark as read
                </p>
              </div>
              <p className="px-2 text-black dark:text-white">{item.message}</p>
              <p className="p-2 text-gray-500 dark:text-gray-400 text-[14px]">
                {format(item.createdAt)}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[calc(60vh-80px)]">
            <p className="text-black dark:text-white">No unread notifications</p>
          </div>
        )}
      </div>
    )}
  </div>
  );
};

export default AdminHeader;