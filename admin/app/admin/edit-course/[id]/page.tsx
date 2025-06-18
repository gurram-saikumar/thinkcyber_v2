"use client";
import React from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from "../../../../app/utils/Heading";
import DashboardHeader from "../../../../app/components/Admin/DashboardHeader";
import EditCourse from "../../../components/Admin/Course/EditCourse";
import CourseOptions from "../../../components/Admin/Course/CourseOptions";
import { Paper } from "@mui/material";
import { motion } from "framer-motion";

type Props = {};

const page = ({ params }: { params: { id: string } }) => {
  // In Next.js, params may be a Promise, so we should use React.use()
  // However, for proper typing, we can cast it as needed
  const { id } = React.use(params as any);
  const [active, setActive] = React.useState(0);
  
  // Ensure ID is properly decoded for URLs with special characters
  const decodedId = id ? decodeURIComponent(id) : "";
  
  // Debug information
  React.useEffect(() => {
    console.log("Edit course page ID:", id);
    console.log("Decoded ID:", decodedId);
  }, [id, decodedId]);

  if (!decodedId)
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold text-gray-700 dark:text-gray-300"
        >
          Loading...
        </motion.div>
      </div>
    );

  return (
    <div>
       
      <div className="flex">
        
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        > 
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6"
          >
            <div className="flex flex-col space-y-6 max-w-[1400px] mx-auto">
              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full"
              >
                <div className="border-l-4 border-purple-500 pl-4 mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    Edit Course
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Update your course details and content
                  </p>
                </div>
              </motion.div>

              {/* Course Setup (Options) Section */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full"
              >
                <Paper
                  elevation={2}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6"
                >
                  <CourseOptions active={active} setActive={setActive} />
                </Paper>
              </motion.div>

              {/* Course Content Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full"
              >
                <EditCourse
                  id={decodedId}
                  activeStep={active}
                  setActiveStep={setActive}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default page;