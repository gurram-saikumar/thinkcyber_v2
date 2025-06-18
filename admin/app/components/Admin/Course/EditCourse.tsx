"use client";
import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "../../../../redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgress, Alert } from "@mui/material";

type Props = {
  id: string;
  activeStep?: number;
  setActiveStep?: (active: number) => void;
};

const EditCourse: FC<Props> = ({ id, activeStep, setActiveStep }) => {
  const [editCourse, { isLoading, isSuccess, error }] = useEditCourseMutation();
  const { data, refetch, isLoading: isDataLoading } = useGetAllCoursesQuery(    
    {},
    { refetchOnMountOrArgChange: true }
  );

  const editCourseData = data?.courses.find((i: any) => i._id === id);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully");
      redirect("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  // Use either the props or local state for active step
  const [localActive, setLocalActive] = useState(0);
  const active = activeStep !== undefined ? activeStep : localActive;
  const setActive = setActiveStep || setLocalActive;

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    categories: "",
    demoUrl: "",
    thumbnail: "",
  });
  
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      videoLength: "",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);

  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    if (editCourseData) {
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        estimatedPrice: editCourseData.estimatedPrice,
        tags: editCourseData.tags,
        level: editCourseData.level,
        categories: editCourseData.categories,
        demoUrl: editCourseData.demoUrl,
        thumbnail: editCourseData.thumbnail,
      });

      setBenefits(editCourseData.benefits);
      setPrerequisites(editCourseData.prerequisites);
      setCourseContentData(editCourseData.courseData);
    }
  }, [editCourseData]);

  const handleSubmit = async () => {
    // Format benefits array
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    // Format prerequisites array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    // Format course content array
    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoLength: courseContent.videoLength,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      })
    );

    //   prepare our data object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      categories: courseInfo.categories,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
    };
    setCourseData(data);
    return data; // Return the data for immediate use
  };

  const handleCourseUpdate = async (e: any) => {
    // Make sure to call handleSubmit first to update courseData
    const formattedData = await handleSubmit();
    
    if (!isLoading) {
      await editCourse({ id, data: formattedData });
    }
  };

  // Animation variants
  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={fadeInVariant}
    >
      {isDataLoading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <CircularProgress size={40} />
          <span className="ml-2 text-blue-600 dark:text-blue-400">Loading course data...</span>
        </div>
      ) : (
        <div className="w-full">
          <AnimatePresence mode="wait">
            {active === 0 && (
              <motion.div
                key="course-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md"
              >
                <CourseInformation
                  courseInfo={courseInfo}
                  setCourseInfo={setCourseInfo}
                  active={active}
                  setActive={setActive}
                  isEdit={true}
                />
              </motion.div>
            )}

            {active === 1 && (
              <motion.div
                key="course-data"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md"
              >
                <CourseData
                  benefits={benefits}
                  setBenefits={setBenefits}
                  prerequisites={prerequisites}
                  setPrerequisites={setPrerequisites}
                  active={active}
                  setActive={setActive}
                  isEdit={true}
                />
              </motion.div>
            )}

            {active === 2 && (
              <motion.div
                key="course-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md"
              >
                <CourseContent
                  active={active}
                  setActive={setActive}
                  courseContentData={courseContentData}
                  setCourseContentData={setCourseContentData}
                  handleSubmit={handleSubmit}
                  isEdit={true}
                />
              </motion.div>
            )}

            {active === 3 && (
              <motion.div
                key="course-preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md"
              >
                <CoursePreview
                  active={active}
                  setActive={setActive}
                  courseData={courseData}
                  handleCourseCreate={handleCourseUpdate}
                  isEdit={true}
                />
                {isLoading && (
                  <div className="flex justify-center mt-4">
                    <CircularProgress size={30} color="primary" />
                    <span className="ml-2 text-blue-600 dark:text-blue-400">Updating your course...</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default EditCourse;
