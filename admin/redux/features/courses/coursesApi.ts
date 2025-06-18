import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      // Add transform response to include debug info
      transformResponse: (response: any) => {
        console.log("API Response:", response);
        return response;
      },
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id: courseId, data }) => {
        console.log("Making edit course request with ID:", courseId);
        return {
          url: `edit-course/${encodeURIComponent(courseId)}`,
          method: "PUT",
          body: data,
          credentials: "include" as const,
        };
      },
      // Add response transformation for better error handling
      transformResponse: (response: any, meta, arg) => {
        console.log("Edit course response:", response);
        console.log("Edit course response meta:", meta);
        return response;
      },
      transformErrorResponse: (response: any, meta, arg) => {
        console.error("Edit course error response:", response);
        console.error("Edit course error meta:", meta);
        console.error("Edit course error args:", arg);
        
        // Try to get more meaningful error information
        let enhancedError = { ...response };
        
        try {
          if (response.status) {
            enhancedError.statusText = `HTTP Error: ${response.status}`;
          }
          
          if (response.data) {
            enhancedError.message = typeof response.data === 'object' 
              ? response.data.message || JSON.stringify(response.data)
              : String(response.data);
          }
        } catch (e) {
          console.error("Error enhancing error response:", e);
        }
        
        return enhancedError;
      },
    }),
    getUsersAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseDetails: builder.query({
      query: (id: any) => {
        // Safely encode the ID, handling potential special characters
        console.log("Fetching course details for ID:", id);
        
        // Make sure we have a valid ID
        if (!id) {
          console.error("Invalid course ID provided:", id);
          throw new Error("Invalid course ID");
        }
        
        // Try to normalize the ID (handle both encoded and non-encoded IDs)
        let normalizedId;
        try {
          // First try to decode in case it's already encoded
          const decodedId = decodeURIComponent(id);
          // Then encode it properly for the URL
          normalizedId = encodeURIComponent(decodedId);
        } catch (e) {
          // If there's an error in decoding, just encode the original
          normalizedId = encodeURIComponent(id);
        }
        
        console.log("Normalized course ID for API request:", normalizedId);
        
        return {
          url: `get-course/${normalizedId}`,
          method: "GET",
          credentials: "include" as const,
        };
      },
      transformResponse: (response: any) => {
        console.log("Course details API response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("Course details API error:", response);
        return response;
      },
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "add-question",
        body: {
          question,
          courseId,
          contentId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "add-answer",
        body: {
          answer,
          courseId,
          contentId,
          questionId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }: any) => ({
        url: `add-review/${courseId}`,
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }: any) => ({
        url: `add-reply`,
        body: {
          comment,
          courseId,
          reviewId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
} = coursesApi;
