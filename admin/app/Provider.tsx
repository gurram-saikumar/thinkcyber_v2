"use client";

import React, { useEffect, useState, FC } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import socketIO from "socket.io-client";
import Cookies from "js-cookie";
import { store } from "../redux/features/store";
import Loader from "./components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRefreshUserTokenMutation } from "@/redux/features/auth/authApi";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socket = socketIO(ENDPOINT, { transports: ["websocket"] });

interface Props {
  children: React.ReactNode;
}

export const Providers: FC<Props> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthWrapper>{children}</AuthWrapper>
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

// Handles token refresh and user state loading
const AuthWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isError } = useLoadUserQuery({});
  const [refreshToken] = useRefreshUserTokenMutation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Refresh token logic
    const accessToken = Cookies.get("accessToken");
    const refresh = Cookies.get("refreshToken");

    if (refresh && (!accessToken || isError)) {
      refreshToken({});
    }
  }, [isError, refreshToken]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    setMounted(true);

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return isLoading ? <Loader /> : <>{children}</>;
};