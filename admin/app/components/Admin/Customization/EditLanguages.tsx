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

const EditLanguages = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Languages", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();
  const [languages, setLanguages] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log("Languages data from API:", data);
    if (data?.layout?.languages) {
      setLanguages(data.layout.languages);
    }
  }, [data]);

  useEffect(() => {
    if (layoutSuccess) {
      console.log("Layout update successful");
      refetch();
      toast.success("Languages updated successfully!", {
        position: "bottom-right",
        duration: 3000
      });
      
      // Set success state and reset after animation
      setSaveSuccess(true);
      setIsSaving(false);
      
      // Reset success state after a delay
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }

    if (error) {
      // Reset saving state
      setIsSaving(false);
      
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
  }, [layoutSuccess, error, refetch]);

  const handleLanguagesAdd = (index: number, value: string) => {
    setLanguages((prevLanguages) => {
      const newLanguages = [...prevLanguages];
      newLanguages[index] = {
        ...newLanguages[index],
        name: value
      };
      return newLanguages;
    });
  };

  const handleLanguageCodeAdd = (index: number, value: string) => {
    setLanguages((prevLanguages) => {
      const newLanguages = [...prevLanguages];
      newLanguages[index] = {
        ...newLanguages[index],
        code: value
      };
      return newLanguages;
    });
  };

  const newLanguageHandler = () => {
    if (languages.length > 0 && (languages[languages.length - 1].name === "" || languages[languages.length - 1].code === "")) {
      toast.error("Language name and code cannot be empty");
    } else {
      setLanguages((prevLanguages) => [...prevLanguages, { name: "", code: "" }]);
    }
  };

  const areLanguagesUnchanged = (
    originalLanguages: any[],
    newLanguages: any[]
  ) => {
    return JSON.stringify(originalLanguages) === JSON.stringify(newLanguages);
  };

  const isAnyLanguageEmpty = (languages: any[]) => {
    // If there are no languages, it's technically not empty (since we're deleting all)
    if (languages.length === 0) return false;
    
    // Otherwise check if any language has an empty name or code
    return languages.some((l) => l.name === "" || l.code === "");
  };

  const editLanguagesHandler = async () => {
    console.log("Current languages:", languages);
    console.log("Original languages:", data?.layout?.languages);
    
    // Set saving state
    setIsSaving(true);

    if (!data?.layout?.languages) {
      console.log("Creating new languages");
      // If no languages exist yet, create new ones
      await editLayout({
        type: "Languages",
        languages,
      });
      return;
    }

    if (
      !areLanguagesUnchanged(data.layout.languages, languages) &&
      !isAnyLanguageEmpty(languages)
    ) {
      console.log("Updating existing languages");
      await editLayout({
        type: "Languages",
        languages,
      });
    } else {
      // Reset saving state if no changes to save
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Manage Available Languages</h2>
      
      {/* Language List */}
      <div className="grid grid-cols-1 gap-3 max-w-3xl mx-auto mb-8">
        {languages && languages.length > 0 ? (
          languages.map((item: any, index: number) => (
            <div 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md" 
              key={item._id || index}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left side - Number and Name */}
                <div className="md:w-1/2">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Language Details</h3>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block text-left mb-2">
                      Language Name
                    </label>
                    <input
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={item.name || ""}
                      onChange={(e) => handleLanguagesAdd(index, e.target.value)}
                      placeholder="Enter language name (e.g. English, Spanish)..."
                    />
                  </div>
                </div>
                
                {/* Right side - Code and Delete Button */}
                <div className="md:w-1/2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Language Code</h3>
                    <button 
                      className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      onClick={() => {
                        // Update the local state
                        setLanguages((prevLanguages) =>
                          prevLanguages.filter((_, i) => i !== index)
                        );
                        
                        // Set a small timeout to allow state update to complete
                        setTimeout(() => {
                          // Save changes automatically after deletion
                          editLanguagesHandler();
                        }, 100);
                      }}
                      title="Delete language"
                    >
                      <AiOutlineDelete className="text-lg" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block text-left mb-2">
                      ISO Language Code
                    </label>
                    <input
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={item.code || ""}
                      onChange={(e) => handleLanguageCodeAdd(index, e.target.value)}
                      placeholder="Enter language code (e.g. en, es)..."
                    />
                    <p className="text-left text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span className="font-medium">Tip:</span> Use standard ISO 639-1 two-letter codes (en, es, fr, etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No languages found. Add your first language below.</p>
          </div>
        )}
      </div>
      
      {/* Add New Language Button */}
      <button
        className="flex items-center justify-center gap-2 mx-auto px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        onClick={newLanguageHandler}
      >
        <IoMdAddCircleOutline className="text-xl" />
        <span>Add New Language</span>
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
              <p className="text-sm">Languages have been successfully updated.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          disabled={isSaving || 
            areLanguagesUnchanged(data?.layout?.languages || [], languages) ||
            isAnyLanguageEmpty(languages)
          }
          className={`px-6 py-2 rounded-md font-medium transition-all flex items-center ${
            isSaving ? "bg-green-400 text-white cursor-wait" :
            areLanguagesUnchanged(data?.layout?.languages || [], languages) ||
            isAnyLanguageEmpty(languages)
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
          }`}
          onClick={
            areLanguagesUnchanged(data?.layout?.languages || [], languages) ||
            isAnyLanguageEmpty(languages) || isSaving
              ? () => null
              : editLanguagesHandler
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

export default EditLanguages;
