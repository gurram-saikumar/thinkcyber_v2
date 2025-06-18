"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseDetailsQuery,
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

const EditCourse: FC<Props> = ({ id, activeStep, setActiveStep }): ReactNode => {
  const [editCourse, { isLoading, isSuccess, error }] = useEditCourseMutation();
    // Decode the ID if it's URL encoded
  const decodedId = decodeURIComponent(id);
  console.log("EditCourse component initialized with ID:", id);
  console.log("Decoded ID:", decodedId);
  
  // Get all courses and specific course data
  const { 
    data, 
    refetch, 
    isLoading: isCoursesLoading 
  } = useGetAllCoursesQuery(    
    {},
    { refetchOnMountOrArgChange: true }
  );

  // Get specific course by ID
  const {
    data: courseDetailsData,
    isLoading: isCourseDetailsLoading,
    error: courseDetailsError,
    refetch: refetchCourseDetails
  } = useGetCourseDetailsQuery(decodedId, { 
    refetchOnMountOrArgChange: true,
    skip: !decodedId // Skip if no ID is provided
  });
    // Add debug logging to understand the data structure
  useEffect(() => {
    if (data) {
      console.log("Courses data:", data);
      console.log("Looking for course ID:", decodedId);
      if (data.courses) {
        console.log("Course IDs available:", data.courses.map((c: any) => ({ id: c._id || c.id, name: c.name })));
      }
    }
    
    if (courseDetailsData) {
      console.log("Course details data:", courseDetailsData);
    }
    
    if (courseDetailsError) {
      // Safely extract and log error information
      try {
        if (typeof courseDetailsError === 'object' && courseDetailsError !== null) {
          if ('status' in courseDetailsError) {
            console.error(`Course details API error: Status ${(courseDetailsError as any).status}`);
          }
          if ('data' in courseDetailsError) {
            console.error("Course details error data:", (courseDetailsError as any).data);
          }
          if ('message' in courseDetailsError) {
            console.error("Course details error message:", (courseDetailsError as any).message);
          }
        }
        console.error("Full course details error:", JSON.stringify(courseDetailsError, null, 2));
      } catch (err) {
        console.error("Error while processing course details error:", err);
      }
    }
  }, [data, decodedId, courseDetailsData, courseDetailsError]);
    // Try to find the course by direct API or from the courses list
  const editCourseData = courseDetailsData?.course || 
    data?.courses?.find((i: any) => 
      i._id === decodedId || 
      i.id === decodedId || 
      i.name === decodedId
    );  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully");
      refetch(); // Refresh the course list
      redirect("/admin/courses");
    }
    if (error) {
      console.log("Error type:", typeof error);
      console.log("Error keys:", Object.keys(error || {}));
      
      try {
        if ("data" in error) {
          const errorData = (error as any).data;
          console.error("Error data:", errorData);
          
          // Handle nested error messages
          const errorMessage = typeof errorData === 'object' && errorData !== null
            ? errorData.message || JSON.stringify(errorData)
            : String(errorData);
            
          toast.error(errorMessage || "Error updating course");
        } else if ("message" in error) {
          console.error("Error message:", (error as any).message);
          toast.error((error as Error).message || "Error updating course");
        } else if ("status" in error) {
          console.error("Error status:", (error as any).status);
          toast.error(`Server error: ${(error as any).status}` || "Error updating course");
        } else {
          console.error("Unknown error format:", error);
          toast.error("An unknown error occurred while updating the course");
        }
      } catch (e) {
        console.error("Error while processing error:", e);
        toast.error("Failed to process error information");
      }
      
      // Log a more detailed error representation
      console.error("Course update error details:", 
        JSON.stringify(error, (key, value) => 
          typeof value === 'undefined' ? 'undefined' : value, 2)
      );
    }
  }, [isSuccess, error, refetch]);

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
  const [courseData, setCourseData] = useState<any>({
    _id: id, // Initialize with the ID from props
    id: id,  // Initialize with the ID from props
  });
  useEffect(() => {
    if (editCourseData) {      
      console.log("Setting course info from editCourseData:", editCourseData);
      
      // Debug estimated price specifically
      console.log("Estimated price from course data:", editCourseData.estimatedPrice);
      
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        estimatedPrice: editCourseData.estimatedPrice || "",
        tags: editCourseData.tags,
        level: editCourseData.level,
        categories: editCourseData.categories,
        demoUrl: editCourseData.demoUrl,
        // Handle thumbnail which could be an object with url property or a string
        thumbnail: editCourseData.thumbnail?.url || editCourseData.thumbnail || "",      
      });// Store the course ID in courseData
      setCourseData((prevData: any) => ({
        ...prevData,
        _id: editCourseData._id || editCourseData.id,
        id: editCourseData._id || editCourseData.id
      }));

      // Create deep copies of arrays to ensure they're not read-only
      if (editCourseData.benefits) {
        const benefitsCopy = editCourseData.benefits.map((benefit: any) => ({...benefit}));
        setBenefits(benefitsCopy);
      }
      
      if (editCourseData.prerequisites) {
        const prerequisitesCopy = editCourseData.prerequisites.map((prerequisite: any) => ({...prerequisite}));
        setPrerequisites(prerequisitesCopy);
      }
      
      if (editCourseData.courseData) {
        const courseDataCopy = JSON.parse(JSON.stringify(editCourseData.courseData));
        setCourseContentData(courseDataCopy);
      }
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
    );    //   prepare our data object
    const data = {
      // Make sure to include the course ID from multiple possible sources
      _id: courseData._id || editCourseData?._id || editCourseData?.id || decodedId,
      id: courseData.id || editCourseData?._id || editCourseData?.id || decodedId,
      name: courseInfo.name,
      description: courseInfo.description,
      categories: courseInfo.categories,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice || "",
      tags: courseInfo.tags,
      // Process thumbnail data correctly
      thumbnail: processThumbnailData(courseInfo.thumbnail),
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
    };
    
    // Log the prepared data to verify ID is included
    console.log("Course data prepared with ID:", data._id || data.id);
    
    setCourseData(data);
    return data; // Return the data for immediate use
  };  const handleCourseUpdate = async (e: any, recoveredId?: string) => {
    try {
      // Make sure to call handleSubmit first to update courseData
      const formattedData = await handleSubmit();
      
      // Use the recovered ID if provided, otherwise use decodedId
      const idToUse = recoveredId || decodedId;
        // Add logging to debug
      console.log("Course update data prepared:", { 
        id: idToUse, 
        dataId: formattedData._id || formattedData.id,
        hasFormattedData: !!formattedData,
        courseInfoName: courseInfo.name,
        estimatedPrice: courseInfo.estimatedPrice || "",
        formattedEstimatedPrice: formattedData.estimatedPrice || ""
      });
      
      if (!idToUse) {
        console.error("Course ID is missing for update");
        toast.error("Course ID is missing. Cannot update course.");
        return;
      }
      
      // Add the ID to the formattedData as a final safety measure
      formattedData._id = formattedData._id || idToUse;
      formattedData.id = formattedData.id || idToUse;
      
      // Check if form data is valid before submitting
      if (!formattedData.name || !formattedData.description) {
        toast.error("Course name and description are required");
        return;
      }
      
      if (!isLoading) {
        // Show a loading toast
        const loadingToast = toast.loading("Updating course...");
        
        console.log(`Submitting course update with ID: ${idToUse}`);
        try {
          // Use a simple async/await pattern without unwrap()
          const response = await editCourse({ 
            id: idToUse, 
            data: formattedData 
          });
          
          // Dismiss the loading toast
          toast.dismiss(loadingToast);
          
          // Check for error in the response
          if ('error' in response) {
            // Log the complete response for debugging
            console.error('Edit course response with error:', JSON.stringify(response, null, 2));
            
            // Get error details
            const errorDetails = response.error;
            console.error('Error details from response:', errorDetails);
            
            let errorMessage = 'Unknown error occurred';
            
            // Try to extract a meaningful error message
            if (errorDetails && typeof errorDetails === 'object') {
              if ('data' in errorDetails && errorDetails.data) {
                errorMessage = typeof errorDetails.data === 'object' 
                  ? (errorDetails.data as any).message || JSON.stringify(errorDetails.data)
                  : String(errorDetails.data);
              } else if ('message' in errorDetails) {
                errorMessage = String(errorDetails.message);
              } else if ('status' in errorDetails) {
                errorMessage = `Server error: ${errorDetails.status}`;
              }
            }
            
            toast.error(`Failed to update course: ${errorMessage}`);
          } else {
            console.log("Course update successful:", response);
            // The success case is handled by the useEffect hook that watches isSuccess
          }
        } catch (apiError) {
          // Dismiss the loading toast
          toast.dismiss(loadingToast);
          
          // Log complete error for debugging
          console.error("Complete API error object:", apiError);
          console.error("API error type:", typeof apiError);
          console.error("API error stringified:", JSON.stringify(apiError, null, 2));            // For empty objects, check if it might be a network issue
            if (typeof apiError === 'object' && apiError !== null && Object.keys(apiError).length === 0) {
              console.error("Empty error object received. This is likely a network issue or CORS problem.");
              toast.error("Network error or CORS issue. Please check your connection and try again.");
              
              // Try to detect if it's a CORS issue
              fetch('/api/v1/me', { credentials: 'include' })
                .then(response => {
                  console.log("CORS test passed:", response.status);
                })
                .catch(e => {
                  console.error("CORS test failed, likely a session or authentication issue:", e);
                  toast.error("Session may have expired. Please try logging in again.");
                });
            } else if (typeof apiError === 'object' && apiError !== null) {
            let errorMessage = 'Unknown error';
            
            // Try different error properties
            if ('status' in apiError) {
              errorMessage = `Status: ${(apiError as any).status}`;
            } else if ('message' in apiError) {
              errorMessage = (apiError as any).message;
            }
            
            console.error(`API error details: ${errorMessage}`);
            toast.error(`Error updating course: ${errorMessage}`);
          } else {
            toast.error(`Error updating course: ${String(apiError)}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleCourseUpdate:", error);
      
      // Provide more details about the error
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        toast.error(`Error updating course: ${error.message}`);
      } else {
        console.error("Unknown error type:", typeof error);
        toast.error("Failed to update course. Check console for details.");
      }
    }
  };

  // Helper function to process thumbnail data correctly for the API
  const processThumbnailData = (thumbnail: any) => {
    // If thumbnail is a standard object with url and public_id, check if it has been changed
    if (
      typeof thumbnail === 'object' && 
      thumbnail !== null && 
      'url' in thumbnail && 
      'public_id' in thumbnail
    ) {
      // If the thumbnail has a tempPreview, it means it was changed
      if ('tempPreview' in thumbnail && thumbnail._changed) {
        console.log("Thumbnail was changed, sending new data");
        return thumbnail.tempPreview;
      } else {
        console.log("Using existing thumbnail object");
        return thumbnail;
      }
    }
    
    // If it's a base64 string or any other format, return as is
    return thumbnail;
  };

  // Animation variants
  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };  // Combined loading state
  const isDataLoading = isCoursesLoading || isCourseDetailsLoading;

  // Add a retry mechanism for course details
  useEffect(() => {
    if (courseDetailsError && decodedId) {
      console.log("Encountered error fetching course details, trying alternatives");
      
      // If we get a 404, try to find the course in the all courses list
      if (data?.courses?.length > 0) {
        console.log("Searching for course in the available courses list");
        const foundCourse = data.courses.find((c: any) => 
          c._id === decodedId || 
          c.id === decodedId || 
          c.name === decodedId ||
          c.demoUrl === decodedId
        );
        
        if (foundCourse) {
          console.log("Found course in available courses:", foundCourse.id || foundCourse._id);
          // Try to refetch using the found ID
          if (foundCourse._id || foundCourse.id) {
            const courseId = foundCourse._id || foundCourse.id;
            if (courseId !== decodedId) {
              console.log("Retrying with correct course ID:", courseId);
              // We're not actually refetching here because it would cause an infinite loop
              // Instead, we're using the found course directly
              setCourseData({
                _id: courseId,
                id: courseId,
                ...foundCourse
              });
            }
          }
        } else {
          console.log("Course not found in available courses list");
        }
      }
    }
  }, [courseDetailsError, data, decodedId]);

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
      ) : !data?.courses || data.courses.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Alert severity="error" className="mb-4">
            No courses found in the database. Please add a course first.
          </Alert>
        </div>      ) : !editCourseData ? (
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Alert severity="error" className="mb-4">
            Could not find course data. Please check the course ID.
          </Alert>
          <div className="text-sm text-gray-500 mt-2">
            Looking for course with ID: {decodedId}
          </div>
          <div className="mt-4 text-blue-600 dark:text-blue-400 cursor-pointer"
            onClick={() => {
              console.log("Manual refetch triggered");
              refetch();
              refetchCourseDetails();
            }}
          >
            Click here to try fetching the course again
          </div>
          {courseDetailsError && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm max-w-2xl">
              <div className="font-medium">Error fetching course details:</div>
              <div className="mt-1">
                {
                  typeof courseDetailsError === 'object' && courseDetailsError !== null ? (
                    <div className="space-y-2">
                      {/* Show status if available */}
                      {'status' in courseDetailsError && (
                        <div>Status: {(courseDetailsError as any).status}</div>
                      )}
                      {/* Show error message if available */}
                      {'message' in courseDetailsError && (
                        <div>Message: {(courseDetailsError as any).message}</div>
                      )}
                      {/* Show error data if available */}
                      {'data' in courseDetailsError && (
                        <div>
                          <div>Error Data:</div>
                          <pre className="mt-1 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-auto max-h-32 text-xs">
                            {JSON.stringify((courseDetailsError as any).data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>Unknown error: {String(courseDetailsError)}</div>
                  )
                }
              </div>
            </div>
          )}
          {data?.courses && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-md overflow-auto max-h-64">
              <div className="font-medium mb-2">Available courses:</div>
              <ul className="list-disc pl-5">
                {data.courses.map((course: any) => (
                  <li key={course._id || course.id} className="mb-1">
                    {course.name} (ID: {course._id || course.id})
                  </li>
                ))}
              </ul>
            </div>
          )}
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
