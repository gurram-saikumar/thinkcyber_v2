import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from "../../../../app/styles/style";
import Ratings from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useEditCourseMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit?: boolean;
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  setActive,
  active,
  isEdit
}) => {
  const dicountPercentenge =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const [editCourse, { isLoading, isSuccess, isError, error }] = useEditCourseMutation();

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = async (e: any) => {
    e.preventDefault();

    if (isEdit) {
      console.log("Update button clicked");

      const courseId = courseData?._id || courseData?.id;
      if (!courseId) {
        console.error("Course ID is missing.");
        toast.error("Course ID is missing. Cannot update course.");
        return;
      }

      try {
        handleCourseCreate(e);
      } catch (err) {
        console.error("Failed to update course:", err);
        toast.error("Failed to update course. Please try again.");
      }
    } else {
      handleCourseCreate(e);
    }
  };

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="w-[90%] m-auto py-5 mb-5"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-5" variants={itemVariant}>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Course Preview</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Review your course before publishing</p>
      </motion.div>

      <motion.div className="w-full relative" variants={itemVariant}>
        <div className="w-full mt-5 bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
          <div className="p-4">
            <CoursePlayer
              videoUrl={courseData?.demoUrl}
              title={courseData?.title}
            />
          </div>
          
          <div className="p-5">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4"
              variants={itemVariant}
            >
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                {courseData?.name}
              </h1>
              <div className="flex items-center">
                <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  {courseData?.price === 0 ? "Free" : "$" + courseData?.price}
                </h1>
                {courseData?.estimatedPrice && (
                  <h1 className="text-[16px] pl-3 text-gray-400 line-through font-Poppins font-[600]">
                    ${courseData?.estimatedPrice}
                  </h1>
                )}
                {courseData?.estimatedPrice && (
                  <h1 className="text-[16px] pl-3 text-green-400 font-Poppins font-[600]">
                    {discountPercentengePrice}% off
                  </h1>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariant}>
              <div className="flex items-center mb-1">
                <div className="flex">
                  <Ratings rating={0} />
                </div>
                <h5 className="text-gray-500 dark:text-gray-300 ml-2">(0 Reviews)</h5>
              </div>
              <h1 className="text-[16px] font-Poppins font-[400] text-black dark:text-white">
                {courseData?.description}
              </h1>
            </motion.div>
          </div>

          <div className="p-5 border-t border-gray-100 dark:border-gray-800">
            <motion.div variants={itemVariant}>
              <h1 className="text-[20px] font-Poppins font-[600] text-black dark:text-white">
                What you will learn from this course?
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariant}>
              {courseData?.benefits?.map((item: any, index: number) => (
                <div className="w-full flex mt-2" key={index}>
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-green-500 dark:text-green-400"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div className="mt-6" variants={itemVariant}>
              <h1 className="text-[20px] font-Poppins font-[600] text-black dark:text-white">
                Prerequisites
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariant}>
              {courseData?.prerequisites?.map((item: any, index: number) => (
                <div className="w-full flex mt-2" key={index}>
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-green-500 dark:text-green-400"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="w-full flex items-center justify-between mt-8"
              variants={itemVariant}
            >
              <motion.div
                className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-gray-200 dark:bg-gray-700 text-center text-black dark:text-white rounded cursor-pointer"
                onClick={() => prevButton()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Prev
              </motion.div>
              <motion.div
                className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-blue-600 text-center text-white rounded cursor-pointer ml-4"
                onClick={createCourse}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEdit ? "Update" : "Create"} Course
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoursePreview;
