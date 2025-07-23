"use client";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/features/api/categoryApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [categories, setCategories] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Support both { categories: [...] } and direct array
    if (Array.isArray(data)) {
      setCategories(data);
    } else if (data && Array.isArray(data.categories)) {
      setCategories(data.categories);
    }
  }, [data]);

  const showSuccessToast = (msg: string) => {
    toast.success(msg, { position: "bottom-right", duration: 3000 });
    setSaveSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCategoriesAdd = (index: number, value: string) => {
    setCategories((prevCategory) => {
      const newCategories = [...prevCategory];
      newCategories[index] = {
        ...newCategories[index],
        title: value
      };
      return newCategories;
    });
  };

  const newCategoriesHandler = () => {
    // Prevent adding if last category is empty or if any category is empty
    if (categories.some((cat) => !cat.title || cat.title.trim() === "")) {
      toast.error("Category title cannot be empty");
      return;
    }
    setCategories((prevCategory) => [...prevCategory, { title: "" }]);
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    // If there are no categories, it's technically not empty (since we're deleting all)
    if (categories.length === 0) return false;
    
    // Otherwise check if any category has an empty title
    return categories.some((q) => q.title === "");
  };
 

  const editCategoriesHandler = async () => {
  setIsSaving(true);
  try {
    // Get original categories from backend
    const originalCategories = Array.isArray(data) ? data : [];

    // Find deleted categories (present in original, not in current)
    const deleted = originalCategories.filter(
      (orig) => !categories.some((cat) => cat._id === orig._id)
    );

    // Delete removed categories from backend
    for (const del of deleted) {
      if (del._id) {
        await deleteCategory({ id: del._id }).unwrap();
      }
    }

    // Create or update categories
    for (const cat of categories) {
      const title = cat.title?.trim();
      const catId = cat.id || cat._id;
      if (!catId && title) {
        try {
          await createCategory({ title: cat.title }); // preserve user casing and spacing
        } catch (err: any) {
          if (err?.data?.message?.includes("Category already exists")) {
            toast.error("Category already exists: " + cat.title);
          } else {
            throw err;
          }
        }
      } else if (catId && title) {
        // Find original
        const orig = originalCategories.find((o) => (o.id || o._id) === catId);
        if (!orig || orig.title !== cat.title) {
          await updateCategory({ id: catId, title: cat.title }); // preserve user casing and spacing
        }
      }
    }
    showSuccessToast("Categories updated successfully!");
    refetch();
  } catch (err: any) {
    setIsSaving(false);
    toast.error(err?.data?.message || "Error updating categories");
  }
};

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Manage Your Topic Categories</h2>
      
      {/* Category List */}
      <div className="grid grid-cols-1 gap-3 max-w-3xl mx-auto mb-8">
        {categories && categories.length > 0 ? (
          categories.map((item: any, index: number) => (
            <div 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md" 
              key={item.id || item._id || index}
            >
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <input
                    className="bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 py-2 px-1 w-full text-lg outline-none transition-colors"
                    value={item.title}
                    onChange={(e) => handleCategoriesAdd(index, e.target.value)}
                    placeholder="Enter category title..."
                  />
                </div>
                <button 
                  className="ml-3 p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  onClick={async () => {
                    const toDelete = categories[index];
                    const deleteId = toDelete.id || toDelete._id;
                    if (deleteId) {
                      setIsSaving(true);
                      try {
                        await deleteCategory({ id: deleteId }).unwrap();
                        setCategories((prevCategory) =>
                          prevCategory.filter((_, i) => i !== index)
                        );
                        showSuccessToast("Category deleted successfully!");
                        refetch();
                      } catch (err: any) {
                        setIsSaving(false);
                        toast.error(err?.data?.message || "Error deleting category");
                      }
                    } else {
                      setCategories((prevCategory) =>
                        prevCategory.filter((_, i) => i !== index)
                      );
                    }
                  }}
                  title="Delete category"
                >
                  <AiOutlineDelete className="text-lg" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No categories found. Add your first category below.</p>
          </div>
        )}
      </div>
      
      {/* Add New Category Button */}
      <button
        className="flex items-center justify-center gap-2 mx-auto px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        onClick={newCategoriesHandler}
      >
        <IoMdAddCircleOutline className="text-xl" />
        <span>Add New Category</span>
      </button>
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-fade-in-down">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4 text-green-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1117.07 2.93 10 10 0 012.93 17.07zm12.73-1.41A8 8 0 104.34 4.34a8 8 0 0011.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">Categories have been successfully updated.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          disabled={isSaving || 
            areCategoriesUnchanged(data || [], categories) ||
            isAnyCategoryTitleEmpty(categories)
          }
          className={`px-6 py-2 rounded-md font-medium transition-all flex items-center ${
            isSaving ? "bg-blue-400 text-white cursor-wait" :
            areCategoriesUnchanged(data || [], categories) ||
            isAnyCategoryTitleEmpty(categories)
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
          }`}
          onClick={
            areCategoriesUnchanged(data || [], categories) ||
            isAnyCategoryTitleEmpty(categories) || isSaving
              ? () => null
              : editCategoriesHandler
          }
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default EditCategories;
