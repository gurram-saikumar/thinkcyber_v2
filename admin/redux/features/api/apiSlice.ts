import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import Cookies from "js-cookie";

// Create a base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  prepareHeaders: (headers) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
  credentials: "include", // This allows cookies like refreshToken to be sent
});

// Create an enhanced query with token refresh capability
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle token expiration or invalid token
  if (result.error && result.error.status === 401) {
    console.log("Token expired or invalid. Attempting to refresh...");

    // Try to get a new token
    const refreshResult = await baseQuery(
      { url: "refresh", method: "GET" },
      api,
      extraOptions
    );

    // If we got a new token, save it and retry the original request
    if (refreshResult.data) {
      const { accessToken, refreshToken, user } = refreshResult.data as any;

      // Store the new tokens
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);

      // Update auth state with new tokens
      api.dispatch(userLoggedIn({ accessToken, refreshToken, user }));

      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh failed, log the user out
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      api.dispatch(userLoggedOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              refreshToken: result.data.refreshToken,
              user: result.data.user,
            })
          );
        } catch (err) {
          console.log("Error loading user:", err);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
