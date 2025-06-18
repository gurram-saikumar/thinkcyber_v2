import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { motion } from "framer-motion";

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  const handleClick = (index: number) => {
    setActive(index);
  };

  return (
    <div className="p-2 flex flex-col w-full h-[85px]"> 
      <div className="flex flex-col w-full">
        <div className="w-full flex flex-row justify-start mb-2">
          <div className="flex flex-row items-start gap-8  w-full">
            {options.map((option: any, index: number) => (
              <motion.div
          key={index}
          className="relative flex flex-col items-center flex-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
              >
          <motion.div
            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center 
              ${active === index 
                ? "bg-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900/30" 
                : active > index
            ? "bg-blue-500 shadow-md shadow-blue-200/70 dark:shadow-blue-900/20"
            : "bg-gray-200 dark:bg-gray-700"} 
              cursor-pointer z-10`}
            onClick={() => handleClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              scale: active === index ? 1.08 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <IoMdCheckmark className={`text-[32px] text-white`} />
          </motion.div>
          
          {/* Step label */}
          <h5
            className={`mt-3 text-center font-medium ${
              active === index
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : active > index 
            ? "text-blue-500 dark:text-blue-300" 
            : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {option}
          </h5>
          
          {/* Connecting line */}
          {index < options.length - 1 && (
            <motion.div 
              className="absolute top-[35px] left-[50%] h-[1px] bg-gray-200 dark:bg-gray-700 z-0"
              style={{ width: "100%", transform: "translateX(20px)" }}
              initial={{ width: 0 }}
              animate={{ 
                width: "100%",
                backgroundColor: active > index ? "#3b82f6" : "#e5e7eb",
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOptions;