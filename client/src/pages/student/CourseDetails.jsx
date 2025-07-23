import { useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration';
import Loading from '../../components/student/Loading';
import courseDetails from '../../data/courseDetails.json';

const CourseDetails = () => {
  const { id } = useParams();
  const currency = 'USD';
  const userData = null; // Replace with actual user data if available
  const [courseData, setCourseData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const fetchCourseData = () => {
    // Find course from courseDetails.json
    const course = courseDetails.find(course => course.id === id);
    console.log(course);
    if (course) {
      setCourseData(course);
    } else {
      toast.error('Course not found');
    }
  }

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn('Login to Enroll')
      }

      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled')
      }

      // For mock data, just show a success message
      toast.success('Successfully enrolled in the course!');
      setIsAlreadyEnrolled(true);

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [id])

  // useEffect(() => {
  //   if (userData && courseData) {
  //     setIsAlreadyEnrolled(userData.enrolledCourses?.includes(courseData.id) || false)
  //   }
  // }, [userData, courseData])

  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });

    return Math.floor(totalRating / course.courseRatings.length);
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.structure.forEach(chapter => {
      if (Array.isArray(chapter.topics)) {
        totalLectures += chapter.topics.length;
      }
    });
    return totalLectures;
  };

  useEffect(() => {
    if (courseData && courseData.structure && courseData.structure.length > 0) {
      setOpenSections({ 0: true });
    }
  }, [courseData]);

  return courseData ? (
    <>
      <div className="bg-gradient-to-b from-[#457AEE] to-[#83AAFF] flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-4 text-left">
        {/* Left Content */} 
        <div className="text-white max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">{courseData.title}</h1>
          <p className="text-sm md:text-base mb-5">
            {courseData.description }
          </p>

          <div className="flex items-center gap-3 text-sm mb-2">
             <span className="text-yellow-400">4.5</span>
            <span className="text-yellow-400">★ ★ ★ ★ ☆</span>
            <span className="text-white">(122 ratings)</span>
            <span className="text-white">21 students</span>
          </div>

          <p className="text-xs text-white">
            Course by <a href="#" className="underline font-medium">{courseData.author}</a>
          </p>
        </div>

        {/* Right Image */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] ">
          <img
            src={assets.BasicSecurityImage}
            alt="Security Illustration"
            className="w-full h-full object-cover"
          />
        </div> 
      </div>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 text-left">

        <div className="z-10 text-gray-500 w-2/3">
          
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <p className='pt-4'>22 sections - 54 lectures - 27h 25m total duration</p>
            <div className="pt-5">
              {courseData.structure && courseData.structure.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-[#F7F9FD]"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2 ">
                      <img src={assets.down_arrow_icon} alt="arrow icon" className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} />
                      <p className="font-medium md:text-base text-sm">{chapter.section}</p>
                    </div>
                    <p className="text-sm md:text-default">{chapter.lectures} - {chapter.duration}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`} >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img src={assets.play_icon} alt="bullet icon" className="w-4 h-4 mt-1" />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{topic}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div> 

            <h2 className="text-xl font-semibold mt-10">Course Description</h2>

            <p className="text-sm md:text-base mb-5 mt-5">
              {courseData.courseDescription }
            </p>

          
        </div>

        <div className="max-w-course-card z-10 shadow-custom-card overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
           <div className="p-5">  
            
            <button onClick={enrollCourse} className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">What&apos;s in the course?</p>
              <ul className="ml-4 pt-2 pb-2 text-sm md:text-default list-disc text-gray-500">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
};

export default CourseDetails;