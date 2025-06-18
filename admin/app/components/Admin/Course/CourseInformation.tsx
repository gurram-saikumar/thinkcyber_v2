import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
  isEdit?: boolean;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
  isEdit = false,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="w-full m-auto p-2">
      <motion.div 
        className="mb-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Course Information</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Fill in the details about your new course</p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className={`${styles.label}`}
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariant}>
          <label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">Course Name</label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="MERN stack LMS platform with next 13"
            className={`${styles.input} transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
          />
        </motion.div>
        
        <motion.div className="mb-5 mt-5" variants={itemVariant}>
          <label className={`text-gray-700 dark:text-gray-200 font-medium`}>Course Description</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Write something amazing..."
            className={`${styles.input} !h-min !py-2 transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </motion.div>
        
        <motion.div className="w-full flex justify-between flex-wrap" variants={itemVariant}>
          <div className="w-full md:w-[45%] mb-5">
            <label className={`text-gray-700 dark:text-gray-200 font-medium`}>Course Price</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="29"
              className={`${styles.input} transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
            />
          </div>
          <div className="w-full md:w-[45%] mb-5">
            <label className={`text-gray-700 dark:text-gray-200 font-medium`}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="price"
              placeholder="79"
              className={`${styles.input} transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
            />
          </div>
        </motion.div>
        
        <motion.div className="w-full flex justify-between flex-wrap" variants={itemVariant}>
          <div className="w-full md:w-[45%] mb-5">
            <label className={`text-gray-700 dark:text-gray-200 font-medium`} htmlFor="email">
              Course Tags
            </label>
            <input
              type="text"
              required
              name=""
              value={courseInfo.tags}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="MERN,Next 13,Socket io,tailwind css,LMS"
              className={`${styles.input} transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
            />
          </div>
          <div className="w-full md:w-[45%] mb-5">
            <label className={`text-gray-700 dark:text-gray-200 font-medium`}>
              Course Categories
            </label>
            <select
              name=""
              id=""
              className={`${styles.input} transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
              value={courseInfo.categories}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories &&
                categories.map((item: any) => (
                  <option value={item.title} key={item._id}>
                    {item.title}
                  </option>
                ))}
            </select>
          </div>
        </motion.div>
        
        <motion.div className="w-full flex justify-between flex-wrap" variants={itemVariant}>
          <div className="w-full md:w-[45%] mb-5">
            <label className={`text-gray-700 dark:text-gray-200 font-medium`}>Course Level</label>
            <input
              type="text"
              name=""
              value={courseInfo.level}
              required
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              id="level"
              placeholder="Beginner/Intermediate/Expert"
              className={`${styles.input} transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
            />
          </div>
          <div className="w-full md:w-[45%] mb-5">
            <label className={`text-gray-700 dark:text-gray-200 font-medium`}>Demo Url</label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.demoUrl}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="eer74fd"
              className={`${styles.input} transition-all focus:border-blue-500 focus:ring focus:ring-blue-200`}
            />
          </div>
        </motion.div>
        
        <motion.div className="w-full mb-5" variants={itemVariant}>
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[15vh] dark:border-gray-600 border-dashed border-2 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragging 
                ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400" 
                : "bg-gray-50 border-gray-300 dark:bg-gray-800/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <motion.img
                src={courseInfo.thumbnail}
                alt="Thumbnail preview"
                className="max-h-full w-full object-contain rounded-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FiUploadCloud className="text-4xl mb-2 mx-auto text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Drag and drop your thumbnail here
                </span>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  or click to browse (PNG, JPG, WEBP)
                </p>
              </motion.div>
            )}
          </label>
        </motion.div>
        
        <motion.div className="w-full flex items-center justify-end" variants={itemVariant}>
          <motion.button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center justify-center transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next Step
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default CourseInformation;
