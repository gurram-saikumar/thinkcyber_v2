import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {
    const { currency, calculateRating } = useContext(AppContext)

    return (
        <Link onClick={() => scrollTo(0, 0)} to={'/course/' + course._id} className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300">
            <img className="w-full h-48 object-cover" src={course.courseThumbnail} alt={course.courseTitle} />
            <div className="p-4 text-left">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold line-clamp-2">{course.courseTitle}</h3>
                    {course.courseLevel && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                            {course.courseLevel}
                        </span>
                    )}
                </div>
                <p className="text-gray-500 mb-2">{course.educator.name}</p>
                <div className="flex items-center space-x-2 mb-2">
                    <p>{calculateRating(course)}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                className="w-3.5 h-3.5"
                                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                                alt=""
                            />
                        ))}
                    </div>
                    <p className="text-gray-500">({course.courseRatings.length})</p>
                </div>
                {course.courseDuration && (
                    <p className="text-sm text-gray-600 mb-2">{course.courseDuration}</p>
                )}
                {course.courseTopics && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {course.courseTopics.slice(0, 2).map((topic, index) => (
                            <span 
                                key={index}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                )}
                <p className="text-base font-semibold text-gray-800">
                    {currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}
                </p>
            </div>
        </Link>
    )
}

export default CourseCard