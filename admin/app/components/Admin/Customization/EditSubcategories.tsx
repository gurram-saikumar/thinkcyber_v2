"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { useGetCategoriesQuery } from "@/redux/features/api/categoryApi";
import { useGetSubCategoriesQuery, useCreateSubCategoryMutation, useUpdateSubCategoryMutation, useDeleteSubCategoryMutation } from "@/redux/features/api/subcategoryApi";
  
type Props = {};

const EditSubcategories = (props: Props) => {
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  // Debug helper function to log category info
  const logCategories = () => {
    console.log("Available categories:", categories.map(cat => ({
      id: cat.id || cat._id,
      title: cat.title
    })));
  };

  const handleSubcategoryChange = (index: number, field: string, value: string | number) => {
    console.log(`handleSubcategoryChange - index: ${index}, field: ${field}, value: ${value}`); // Debug log
    setSubcategories((prevSubcategories) => {
      const newSubcategories = [...prevSubcategories];
      
      // When changing categoryId, check if the new category already has a subcategory with this title
      if (field === 'categoryId' && value && prevSubcategories[index].title) {
        const title = prevSubcategories[index].title.toLowerCase().trim();
        
        // Skip the check if title is empty
        if (title) {
          const existingWithSameTitle = prevSubcategories.some(
            (sub, idx) => idx !== index && 
                        Number(sub.categoryId) === Number(value) && 
                        sub.title && sub.title.toLowerCase().trim() === title
          );
          
          if (existingWithSameTitle) {
            // Get category name for better error message
            const categoryName = categories.find(cat => (cat.id || cat._id) === value)?.title || "this category";
            
            toast.error(`"${prevSubcategories[index].title}" already exists in ${categoryName}. Please use a different title.`, {
              duration: 5000,
            });
            
            // Log debug info to console
            console.log(`Duplicate check: "${title}" in category "${value}"`);
            logCategories();
          }
        }
      }
      
      newSubcategories[index] = {
        ...newSubcategories[index],
        [field]: value
      };
      return newSubcategories;
    });
  };
  // Use new API slices only
  const { data: subcategoriesData, isLoading: subLoading, refetch: subRefetch } = useGetSubCategoriesQuery();
  // Debug: log the API response for subcategories
  useEffect(() => {
    console.log('subcategoriesData:', subcategoriesData);
  }, [subcategoriesData]);
  const { data: categoriesData, isLoading: catLoading, refetch: refetchCategories } = useGetCategoriesQuery();

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (Array.isArray(subcategoriesData)) {
      setSubcategories(subcategoriesData);
    }
    if (Array.isArray(categoriesData)) {
      setCategories(categoriesData);
    } else if (categoriesData && Array.isArray(categoriesData.categories)) {
      setCategories(categoriesData.categories);
    } else if (categoriesData && categoriesData.categories) {
      setCategories(categoriesData.categories);
    }
  }, [subcategoriesData, categoriesData]);

  const newSubcategoryHandler = () => {
    if (subcategories.some((s) => !s.title || !s.categoryId)) {
      toast.error("Please complete all existing subcategories before adding a new one");
      return;
    }
    
    // Check for potential duplicates
    const newSubcategory = { title: "", categoryId: "" };
    setSubcategories((prevSubcategories) => [...prevSubcategories, newSubcategory]);
  };

  const areSubcategoriesUnchanged = (
    originalSubcategories: any[],
    newSubcategories: any[]
  ) => {
    return JSON.stringify(originalSubcategories) === JSON.stringify(newSubcategories);
  };

  const isAnySubcategoryEmpty = (subcategories: any[]) => {
    // If there are no subcategories, it's technically not empty (since we're deleting all)
    if (subcategories.length === 0) return false;
    
    // Otherwise check if any subcategory is missing required fields
    return subcategories.some((s) => s.title === "" || s.categoryId === "");
  };

  const editSubcategoriesHandler = async () => {
    setIsSaving(true);
    try {
      // Get original subcategories from backend
      const originalSubcategories = Array.isArray(subcategoriesData) ? subcategoriesData : [];
      
      // Case-insensitive check for duplicates before saving
      const hasDuplicates = subcategories.some((sub, idx) => {
        if (!sub.title || !sub.categoryId) return false;
        
        return subcategories.some((otherSub, otherIdx) => 
          idx !== otherIdx && 
          String(otherSub.categoryId) === String(sub.categoryId) && 
          otherSub.title?.toLowerCase().trim() === sub.title.toLowerCase().trim()
        );
      });
      
      // Debug output to console
      if (hasDuplicates) {
        console.log("Found duplicates in subcategories:", 
          subcategories.map(s => ({title: s.title, categoryId: s.categoryId}))
        );
      }
      
      if (hasDuplicates) {
        setIsSaving(false);
        toast.error("You have duplicate subcategory titles in the same category. Please fix before saving.", {
          duration: 5000,
        });
        return;
      }

      // Find deleted subcategories
      const deleted = originalSubcategories.filter(
        (orig) => !subcategories.some((sub) => (sub.id || sub._id) === (orig.id || orig._id))
      );
      for (const del of deleted) {
        const delId = del.id || del._id;
        if (delId) {
          // Ensure ID is a number
          const delIdNum = Number(delId);
          console.log('Deleting subcategory with ID:', { id: delIdNum, originalType: typeof delId });
          await deleteSubCategory({ id: delIdNum }).unwrap();
        }
      }

      // Process subcategories by category for better organization
      const subcategoriesByCategory: {[key: string]: any[]} = {};
      subcategories.forEach(sub => {
        if (!sub.categoryId) return;
        const catId = String(sub.categoryId); // Ensure string key
        if (!subcategoriesByCategory[catId]) {
          subcategoriesByCategory[catId] = [];
        }
        subcategoriesByCategory[catId].push(sub);
      });
      
      // Create or update subcategories by category
      for (const categoryId in subcategoriesByCategory) {
        console.log(`Processing categoryId: ${categoryId}`); // Debug log
        for (const sub of subcategoriesByCategory[categoryId]) {
          console.log(`Subcategory being processed:`, sub); // Debug log
          const subId = sub.id || sub._id;
          
          // Only create if not present in originalSubcategories
          if (!subId && sub.title && sub.categoryId) {
            const alreadyExists = originalSubcategories.some(
              (o) => o.title?.toLowerCase().trim() === sub.title.toLowerCase().trim() && Number(o.categoryId) === Number(sub.categoryId)
            );
            if (!alreadyExists) {
              // Ensure categoryId is a number
              const categoryIdNum = Number(sub.categoryId);
              console.log('Creating subcategory with:', { title: sub.title, categoryId: categoryIdNum, originalType: typeof sub.categoryId });
              await createSubCategory({ title: sub.title, categoryId: categoryIdNum }).unwrap();
            }
          } else if (subId && sub.title && sub.categoryId) {
            // Find original
            const orig = originalSubcategories.find((o) => (o.id || o._id) === subId);
            if (orig && (orig.title.toLowerCase() !== sub.title.toLowerCase() || orig.categoryId !== sub.categoryId)) {
              // Check if we're creating a duplicate when updating title
              if (String(orig.categoryId) === String(sub.categoryId) && orig.title.toLowerCase().trim() !== sub.title.toLowerCase().trim()) {
                const duplicateExists = originalSubcategories.some(
                  o => o.id !== subId && Number(o.categoryId) === Number(sub.categoryId) && o.title?.toLowerCase().trim() === sub.title.toLowerCase().trim()
                );
                if (duplicateExists) {
                  setIsSaving(false);
                  toast.error(`"${sub.title}" already exists in this category. Please use a different title.`, {
                    duration: 5000,
                  });
                  return;
                }
              }
              
              // Ensure categoryId is a number
              const categoryIdNum = Number(sub.categoryId);
              console.log('Updating subcategory with:', { id: subId, title: sub.title, categoryId: categoryIdNum, originalType: typeof sub.categoryId });
              await updateSubCategory({ id: subId, title: sub.title, categoryId: categoryIdNum }).unwrap();
            }
          }
        }
      }
      
      toast.success("Subcategories updated successfully", {
        position: "bottom-right",
        duration: 3000,
        icon: '✅',
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsSaving(false);
      subRefetch();
    } catch (err: any) {
      setIsSaving(false);
      toast.error(err?.data?.message || "Error updating subcategories");
    }
  };
  const getCategoryTitle = (categoryId: string) => {
    if (!categoryId) return "Unknown Category";
    if (!categories || categories.length === 0) return categoryId;
    
    // For UUID format, always look by id/._id
    const categoryById = categories.find(cat => (cat.id || cat._id) === categoryId);
    if (categoryById) return categoryById.title;
    
    // Fallback to showing the UUID (truncated for display)
    return categoryId.length > 20 ? `${categoryId.substring(0, 8)}...` : categoryId;
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
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Manage Your Subcategories</h2>
      
      {/* Subcategories List */}
      <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto mb-8">
        {subcategories && subcategories.length > 0 ? (
          subcategories.map((item: any, index: number) => (
            <div 
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md" 
              key={item._id || index}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left side - Number and Title */}
                <div className="md:w-1/2">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Subcategory Details</h3>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block text-left mb-2">
                      Subcategory Title
                    </label>
                    <input
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={item.title}
                      onChange={(e) => handleSubcategoryChange(index, 'title', e.target.value)}
                      placeholder="Enter subcategory title..."
                    />
                  </div>
                </div>
                
                {/* Right side - Parent Category */}
                <div className="md:w-1/2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Parent Category</h3>
                    <button 
                      className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      onClick={() => {
                        // Update the local state
                        setSubcategories((prevSubcategories) =>
                          prevSubcategories.filter((_, i) => i !== index)
                        );
                        
                        // Set a small timeout to allow state update to complete
                        setTimeout(() => {
                          // Save changes automatically after deletion
                          editSubcategoriesHandler();
                        }, 100);
                      }}
                      title="Delete subcategory"
                    >
                      <AiOutlineDelete className="text-lg" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block text-left mb-2">
                      Select Parent Category
                    </label>
                    <select
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={item.categoryId}
                      onChange={(e) => handleSubcategoryChange(index, 'categoryId', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.id || cat._id || `cat-${cat.title}`} value={cat.id || cat._id}>
                            {cat.title}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No categories available</option>
                      )}
                    </select>
                    {item.categoryId && (
                      <p className="text-left text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span className="font-medium">Current parent:</span> {getCategoryTitle(item.categoryId)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No subcategories found. Add your first subcategory below.</p>
          </div>
        )}
      </div>
      
      {/* Add New Subcategory Button */}
      <button
        className="flex items-center justify-center gap-2 mx-auto px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        onClick={newSubcategoryHandler}
      >
        <IoMdAddCircleOutline className="text-xl" />
        <span>Add New Subcategory</span>
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
              <p className="text-sm">Subcategories have been successfully updated.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          disabled={isSaving || 
            areSubcategoriesUnchanged(Array.isArray(subcategoriesData) ? subcategoriesData : [], subcategories) ||
            isAnySubcategoryEmpty(subcategories)
          }
          className={`px-6 py-2 rounded-md font-medium transition-all flex items-center ${
            isSaving ? "bg-purple-400 text-white cursor-wait" :
            areSubcategoriesUnchanged(Array.isArray(subcategoriesData) ? subcategoriesData : [], subcategories) ||
            isAnySubcategoryEmpty(subcategories)
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
          }`}
          onClick={
            areSubcategoriesUnchanged(Array.isArray(subcategoriesData) ? subcategoriesData : [], subcategories) ||
            isAnySubcategoryEmpty(subcategories) || isSaving
              ? () => null
              : editSubcategoriesHandler
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

export default EditSubcategories;
