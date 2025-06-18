"use client";

import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

type Props = {};

const EditSubcategories = (props: Props) => {
  const { data: subcategoriesData, isLoading: subLoading, refetch: subRefetch } = useGetHeroDataQuery("Subcategories", {
    refetchOnMountOrArgChange: true,
  });
    // Use a more aggressive caching strategy for categories
  const { data: categoriesData, isLoading: catLoading, refetch: refetchCategories } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
    // Prioritize cached data while revalidating in the background
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    if (subcategoriesData?.layout?.subcategories) {
      console.log("Subcategories data:", subcategoriesData.layout.subcategories);
      setSubcategories(subcategoriesData.layout.subcategories);
    }
    
    // Log the complete categories data to debug
    console.log("Categories data received:", categoriesData);
    
    if (categoriesData?.layout?.categories) {
      console.log("Categories available:", categoriesData.layout.categories);
      setCategories(categoriesData.layout.categories);
    } else {
      console.warn("Categories data not available in expected format:", categoriesData);
    }
  }, [subcategoriesData, categoriesData]);
  useEffect(() => {
    if (layoutSuccess) {
      subRefetch();
      toast.success("Subcategories updated successfully");
    }

    if (error) {
      // Safely extract error information without logging the full error object
      if ("data" in error) {
        const errorData = error as any;
        const errorMessage = errorData?.data?.message || "Something went wrong";
        console.error("Layout update error:", errorMessage);
        
        // Special handling for authentication errors
        if (errorMessage.includes("Access token is not valid") || 
            errorMessage.includes("Not authenticated") || 
            errorMessage.includes("jwt")) {
          toast.error("Your session has expired. Please refresh the page or log in again.");
          
          // You could also redirect to login here if needed
          // window.location.href = "/login";
        } else {
          toast.error(errorMessage);
        }
      } else if ("message" in error) {
        console.error("Layout update error:", (error as Error).message);
        toast.error((error as Error).message || "Something went wrong");
      } else {
        console.error("Layout update error occurred");
        toast.error("Something went wrong");
      }
    }
  }, [layoutSuccess, error, subRefetch]);

  const handleSubcategoryChange = (index: number, field: string, value: string) => {
    setSubcategories((prevSubcategories) => {
      const newSubcategories = [...prevSubcategories];
      newSubcategories[index] = {
        ...newSubcategories[index],
        [field]: value
      };
      return newSubcategories;
    });
  };

  const newSubcategoryHandler = () => {
    if (subcategories.length > 0 && 
        (subcategories[subcategories.length - 1].title === "" || 
         subcategories[subcategories.length - 1].categoryId === "")) {
      toast.error("Subcategory must have both title and category");
    } else {
      setSubcategories((prevSubcategories) => [...prevSubcategories, { title: "", categoryId: "" }]);
    }
  };

  const areSubcategoriesUnchanged = (
    originalSubcategories: any[],
    newSubcategories: any[]
  ) => {
    return JSON.stringify(originalSubcategories) === JSON.stringify(newSubcategories);
  };

  const isAnySubcategoryEmpty = (subcategories: any[]) => {
    return subcategories.some((s) => s.title === "" || s.categoryId === "");
  };

  const editSubcategoriesHandler = async () => {
    if (!subcategoriesData?.layout?.subcategories) {
      // If no subcategories exist yet, create new ones
      await editLayout({
        type: "Subcategories",
        subcategories,
      });
      return;
    }

    if (
      !areSubcategoriesUnchanged(subcategoriesData.layout.subcategories, subcategories) &&
      !isAnySubcategoryEmpty(subcategories)
    ) {
      await editLayout({
        type: "Subcategories",
        subcategories,
      });
    }
  };
  const getCategoryTitle = (categoryId: string) => {
    if (!categoryId) return "Unknown Category";
    if (!categories || categories.length === 0) return categoryId;
    
    // Try to find by title first
    const categoryByTitle = categories.find(cat => cat.title === categoryId);
    if (categoryByTitle) return categoryByTitle.title;
    
    // Otherwise try by _id
    const categoryById = categories.find(cat => cat._id === categoryId);
    if (categoryById) return categoryById.title;
    
    return categoryId || "Unknown Category";
  };
  if (subLoading) {
    return <Loader />;
  }
  
  // Show a different message when specifically categories are loading
  if (catLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading categories data...</p>
      </div>
    );
  }
    // Warning if categories couldn't be loaded but subcategories are ready
  if (!catLoading && (!categories || categories.length === 0)) {
    console.warn("Categories not available, but loading completed");
    
    // Add a button to retry loading categories
    return (
      <div className="w-full max-w-[1200px] mx-auto p-5">
        <div className="border-l-4 border-red-500 pl-4 mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Categories Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">
            We couldn't load the categories data needed for subcategory management. 
            Make sure you've created categories first.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => refetchCategories()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry Loading Categories
            </button>
            <a 
              href="/admin/categories" 
              className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go To Categories Management
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[120px] text-center">
      <h1 className={`${styles.title}`}>All Subcategories</h1>
      <div className="flex flex-col items-center">
        {subcategories.map((item: any, index: number) => (
          <div className="p-3 w-full max-w-[700px]" key={item._id || index}>
            <div className="flex items-center justify-between w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center w-full">
                <div className="md:w-1/2 mb-2 md:mb-0 md:mr-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300 block text-left mb-1">Subcategory Title</label>
                  <input
                    className={`${styles.input} w-full`}
                    value={item.title}
                    onChange={(e) => handleSubcategoryChange(index, 'title', e.target.value)}
                    placeholder="Enter subcategory title..."
                  />
                </div>
                <div className="md:w-1/2">
                  <label className="text-sm text-gray-600 dark:text-gray-300 block text-left mb-1">Parent Category</label>                  <select
                    className={`${styles.input} w-full`}
                    value={item.categoryId}
                    onChange={(e) => handleSubcategoryChange(index, 'categoryId', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat._id || `cat-${cat.title}`} value={cat.title}>
                          {cat.title}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No categories available</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <AiOutlineDelete
                  className="dark:text-white text-black text-[18px] cursor-pointer"
                  onClick={() => {
                    setSubcategories((prevSubcategories) =>
                      prevSubcategories.filter((_, i) => i !== index)
                    );
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <br />
      <div className="w-full flex justify-center">
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newSubcategoryHandler}
        />
      </div>
      <div
        className={`${
          styles.button
        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
        ${
          areSubcategoriesUnchanged(subcategoriesData?.layout?.subcategories || [], subcategories) ||
          isAnySubcategoryEmpty(subcategories)
            ? "!cursor-not-allowed"
            : "!cursor-pointer !bg-[#42d383]"
        }
        !rounded absolute bottom-12 right-12`}
        onClick={
          areSubcategoriesUnchanged(subcategoriesData?.layout?.subcategories || [], subcategories) ||
          isAnySubcategoryEmpty(subcategories)
            ? () => null
            : editSubcategoriesHandler
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditSubcategories;
