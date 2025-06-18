"use client";
import React, { FC, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/features/store";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRefreshUserTokenMutation } from "@/redux/features/auth/authApi";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

interface ProvidersProps {
  children: any;
}

export function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}

export const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isError } = useLoadUserQuery({});
  const [refreshToken] = useRefreshUserTokenMutation();
  const [isMounted, setIsMounted] = useState(false);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);

  // Check if we need to refresh the token
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const tokenExists = Cookies.get("refreshToken");
    
    // If we have a refresh token but no access token or the access token is invalid
    if (tokenExists && (!accessToken || isError)) {
      // Trigger a token refresh
      refreshToken({});
      setTokenRefreshed(true);
    }
  }, [isError, refreshToken]);

  useEffect(() => {
    socketId.on("connection", () => {});
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <SessionProvider>{children}</SessionProvider>
        </div>
      )}
    </div>
  );
};
