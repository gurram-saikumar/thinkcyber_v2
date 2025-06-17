"use client";
import React, { FC, useEffect, useState } from "react";
import Heading from "./utils/Heading";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/SignUp";
import Verification from "./components/Auth/Verification";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

interface Props {}

const Page: FC<Props> = (props) => {
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user && user.role === "admin") {
      redirect("/admin");
    }
  }, [mounted, user]);

  if (!mounted) return null;

  return (
    <div>
      <Heading
        title="ThinkCyber - Admin"
        description="ThinkCyber is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <div className="w-[90%] md:w-[420px] m-auto h-screen flex items-center justify-center">
        {route === "Login" && <Login setRoute={setRoute} />}
        {route === "Sign-up" && <Signup setRoute={setRoute} />}
        {route === "Verification" && <Verification setRoute={setRoute} />}
      </div>
    </div>
  );
};

export default Page;
