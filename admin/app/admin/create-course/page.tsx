"use client";
import React from "react";
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import CourseOptions from "../../components/Admin/Course/CourseOptions";
import { Paper } from "@mui/material";
import { motion } from "framer-motion";

type Props = {};

const page = (props: Props) => {
  const [active, setActive] = React.useState(0);

  return (
    <motion.div
      className="p-4 lg:p-6 max-w-[1400px] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-6">
        {/* Course Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full"
        >
          <div className="border-l-4 border-blue-500 pl-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              Create New Course
            </h1> 
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
          <CreateCourse activeStep={active} setActiveStep={setActive} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default page;