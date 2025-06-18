"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { styles } from "../../../app/styles/style";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import "./Login.css";

type Props = {
  setRoute: (route: string) => void;
  setOpen?: (open: boolean) => void;
  refetch?: any;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [login, { isSuccess, error, isLoading: isLoginLoading }] = useLoginMutation();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      setIsLoading(true);
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully!");
      // Add a delay before redirecting to show loading state
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    }
    if (error) {
      setIsLoading(false);
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, router]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <>
      {isLoading && isSuccess ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg text-center">
            <div className="mb-4">
              <div className="loader mx-auto"></div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-Poppins">Redirecting to dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-Poppins">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 font-Poppins">Sign in to your ThinkCyber account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-Poppins ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-Poppins">
              Don't have an account yet?{" "}
              <button
                onClick={() => setRoute("Sign-up")}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
