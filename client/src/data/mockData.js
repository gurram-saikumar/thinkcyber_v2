export const mockCourses = [
  {
    _id: "course1",
    courseTitle: "Complete Web Development Bootcamp",
    courseThumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
    coursePrice: 99.99,
    discount: 20,
    courseRatings: [
      { rating: 5, review: "Excellent course! Very comprehensive." },
      { rating: 4, review: "Great content and well structured." },
      { rating: 5, review: "Best web development course I've taken." }
    ],
    educator: {
      name: "John Smith",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60"
    },
    courseContent: [
      {
        chapterTitle: "Introduction to Web Development",
        chapterContent: [
          {
            lectureTitle: "Welcome to the Course",
            lectureDuration: 15,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Setting Up Your Development Environment",
            lectureDuration: 30,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Understanding HTML Basics",
            lectureDuration: 45,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      },
      {
        chapterTitle: "CSS Fundamentals",
        chapterContent: [
          {
            lectureTitle: "Introduction to CSS",
            lectureDuration: 40,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "CSS Selectors and Properties",
            lectureDuration: 50,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Responsive Design Principles",
            lectureDuration: 60,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      }
    ],
    courseDescription: "Master web development from scratch with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, and modern frameworks. Build real-world projects and become a full-stack developer.",
    courseDuration: "40 hours",
    courseLevel: "Beginner to Advanced",
    courseTopics: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"]
  },
  {
    _id: "course2",
    courseTitle: "Data Science and Machine Learning",
    courseThumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    coursePrice: 149.99,
    discount: 15,
    courseRatings: [
      { rating: 5, review: "Incredible depth of knowledge." },
      { rating: 5, review: "Perfect for beginners in data science." },
      { rating: 4, review: "Great practical examples." }
    ],
    educator: {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60"
    },
    courseContent: [
      {
        chapterTitle: "Introduction to Data Science",
        chapterContent: [
          {
            lectureTitle: "What is Data Science?",
            lectureDuration: 20,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Python for Data Science",
            lectureDuration: 45,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Data Analysis with Pandas",
            lectureDuration: 60,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      },
      {
        chapterTitle: "Machine Learning Fundamentals",
        chapterContent: [
          {
            lectureTitle: "Introduction to Machine Learning",
            lectureDuration: 40,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Supervised Learning Algorithms",
            lectureDuration: 55,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Model Evaluation and Validation",
            lectureDuration: 50,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      }
    ],
    courseDescription: "Learn data science and machine learning from the ground up. Master Python, statistical analysis, and machine learning algorithms. Work on real-world projects and build your portfolio.",
    courseDuration: "50 hours",
    courseLevel: "Intermediate",
    courseTopics: ["Python", "Data Analysis", "Machine Learning", "Deep Learning", "Statistics"]
  },
  {
    _id: "course3",
    courseTitle: "Mobile App Development with React Native",
    courseThumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
    coursePrice: 79.99,
    discount: 25,
    courseRatings: [
      { rating: 5, review: "Best React Native course out there!" },
      { rating: 4, review: "Very practical and hands-on." },
      { rating: 5, review: "Great instructor, clear explanations." }
    ],
    educator: {
      name: "Mike Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"
    },
    courseContent: [
      {
        chapterTitle: "React Native Basics",
        chapterContent: [
          {
            lectureTitle: "Introduction to React Native",
            lectureDuration: 25,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Setting Up Development Environment",
            lectureDuration: 35,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Components and Props",
            lectureDuration: 40,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      },
      {
        chapterTitle: "Advanced React Native",
        chapterContent: [
          {
            lectureTitle: "State Management with Redux",
            lectureDuration: 45,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Navigation and Routing",
            lectureDuration: 50,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Working with APIs",
            lectureDuration: 55,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      }
    ],
    courseDescription: "Build cross-platform mobile apps with React Native. Learn to create beautiful, performant apps for iOS and Android. Master state management, navigation, and API integration.",
    courseDuration: "35 hours",
    courseLevel: "Intermediate",
    courseTopics: ["React Native", "JavaScript", "Mobile Development", "Redux", "APIs"]
  },
  {
    _id: "course4",
    courseTitle: "UI/UX Design Masterclass",
    courseThumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
    coursePrice: 89.99,
    discount: 10,
    courseRatings: [
      { rating: 5, review: "Amazing design principles explained." },
      { rating: 5, review: "Great practical examples." },
      { rating: 4, review: "Very comprehensive course." }
    ],
    educator: {
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60"
    },
    courseContent: [
      {
        chapterTitle: "Design Fundamentals",
        chapterContent: [
          {
            lectureTitle: "Introduction to UI/UX Design",
            lectureDuration: 30,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Color Theory and Typography",
            lectureDuration: 45,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Layout and Composition",
            lectureDuration: 40,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      },
      {
        chapterTitle: "Design Tools and Prototyping",
        chapterContent: [
          {
            lectureTitle: "Figma Basics",
            lectureDuration: 50,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Creating Interactive Prototypes",
            lectureDuration: 55,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "User Testing and Feedback",
            lectureDuration: 45,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      }
    ],
    courseDescription: "Master UI/UX design principles and tools. Learn to create beautiful, user-friendly interfaces. Understand user psychology and create effective design systems.",
    courseDuration: "30 hours",
    courseLevel: "Beginner to Intermediate",
    courseTopics: ["UI Design", "UX Design", "Figma", "Prototyping", "User Research"]
  },
  {
    _id: "course5",
    courseTitle: "Digital Marketing Strategy",
    courseThumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    coursePrice: 69.99,
    discount: 15,
    courseRatings: [
      { rating: 5, review: "Very practical and up-to-date." },
      { rating: 4, review: "Great insights into digital marketing." },
      { rating: 5, review: "Excellent course structure." }
    ],
    educator: {
      name: "David Brown",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60"
    },
    courseContent: [
      {
        chapterTitle: "Digital Marketing Fundamentals",
        chapterContent: [
          {
            lectureTitle: "Introduction to Digital Marketing",
            lectureDuration: 25,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "SEO Basics",
            lectureDuration: 40,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Social Media Marketing",
            lectureDuration: 45,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      },
      {
        chapterTitle: "Advanced Marketing Strategies",
        chapterContent: [
          {
            lectureTitle: "Content Marketing",
            lectureDuration: 50,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Email Marketing Campaigns",
            lectureDuration: 45,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            lectureTitle: "Analytics and ROI",
            lectureDuration: 40,
            lectureUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        ]
      }
    ],
    courseDescription: "Learn modern digital marketing strategies. Master SEO, social media marketing, content creation, and analytics. Create effective marketing campaigns and measure their success.",
    courseDuration: "25 hours",
    courseLevel: "Beginner to Advanced",
    courseTopics: ["SEO", "Social Media", "Content Marketing", "Email Marketing", "Analytics"]
  }
]; 