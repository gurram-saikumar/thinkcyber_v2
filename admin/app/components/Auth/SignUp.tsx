"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        // Check if the error data has a message property
        if (errorData.data?.message) {
          toast.error(errorData.data.message);
        } else if (errorData.data?.error) {
          toast.error(errorData.data.error);
        } else if (typeof errorData.data === 'object' && errorData.data !== null) {
          // If data is an object but doesn't have message property
          const errorMessage = JSON.stringify(errorData.data);
          toast.error(errorMessage);
        } else {
          // Fallback error message
          toast.error("Registration failed. Please try again.");
        }
      } else {
        // Generic error message
        toast.error("An error occurred during registration");
        console.error("Registration error:", error);
      }
    }
  }, [isSuccess, error, data]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name,
        email,
        password,
      };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-Poppins">Create Account</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 font-Poppins">Join ThinkCyber today</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 font-Poppins" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              id="name"
              placeholder="John Doe"
              className={`${
                errors.name && touched.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              } block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 font-Poppins`}
            />
          </div>
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-500 font-Poppins">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 font-Poppins" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              id="email"
              placeholder="yourname@example.com"
              className={`${
                errors.email && touched.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              } block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 font-Poppins`}
            />
          </div>
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-500 font-Poppins">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 font-Poppins" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={!show ? "password" : "text"}
              name="password"
              value={values.password}
              onChange={handleChange}
              id="password"
              placeholder="••••••••"
              className={`${
                errors.password && touched.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              } block w-full pl-10 pr-10 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 font-Poppins`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {!show ? (
                <AiOutlineEyeInvisible
                  className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-500"
                  onClick={() => setShow(true)}
                />
              ) : (
                <AiOutlineEye
                  className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-500"
                  onClick={() => setShow(false)}
                />
              )}
            </div>
          </div>
          {errors.password && touched.password && (
            <p className="mt-1 text-sm text-red-500 font-Poppins">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-Poppins"
        >
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 font-Poppins">
          Already have an account?{" "}
          <button
            onClick={() => setRoute("Login")}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
