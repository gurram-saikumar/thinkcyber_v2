import React from 'react';
import Slider from 'react-slick';
import { assets } from '../../assets/assets';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true, 
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: (
    <button className="slick-next slick-arrow absolute top-4 right-4 z-10 bg-white text-black p-2 rounded-full shadow">
    &#8250;
    </button>
    ),
    prevArrow: (
    <button className="slick-prev slick-arrow absolute top-4 right-16 z-10 bg-white text-black p-2 rounded-full shadow">
    &#8249;
    </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const topics = [
    {
      id: "01",
      title: "Basic Security",
      description: "Basic security principles revolve",
      icon: assets.basic_security_icon,
      borderColor: "border-blue-600",
      textColor: "text-blue-600",
    },
    {
      id: "02",
      title: "Business Owner",
      description: "What does a business owner need to know",
      icon: assets.business_owner_icon,
      borderColor: "border-[#146DA5]",
      textColor: "text-[#146DA5]",
    },
    {
      id: "03",
      title: "Mobile End User",
      description: "What does a mobile end user need to know",
      icon: assets.follower_icon,
      borderColor: "border-[#039198]",
      textColor: "text-[#039198]",
    },
  ];

  return (
    <div className="flex flex-col items-start justify-start w-full md:pt-20 pt-0 px-7 md:px-0 space-y-0 text-left bg-white">
      {/* Existing Hero Content */}
      <h1 className="relative font-bold text-gray-800 max-w-3xl mx-10 text-[46px]">
        LEADING THE WAY 
      </h1>
      <p className="md:block hidden text-gray-500 max-w-full mx-10 pt-10">
        Our company provides top-quality knowledge on digital and cyber security that can help to meet the needs of people – which can be
        different audience. We have a proven track record of success in the industry and are committed to exceeding expectations. With a team of experienced professionals and cutting-edge technology,
        we are well-equipped to deliver results that matter.
      </p>
      <span className=" text-gray-500 max-w-full mx-10 py-4">
        In today's fast-paced business environment, it's essential to stay ahead on security. That's why our company is always looking for ways to innovate and improve our products and services.
      </span>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-10 py-10">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.BookIcon} alt="Basic Learning" className="w-12 h-12 p-[0.3rem] mb-4 bg-[#E7F6F8] rounded-2xl" />
          <h3 className="text-lg font-bold mb-2">Basic Learning</h3>
          <p className="text-sm">Smiles spoke total few great had never their too. Amongst moments do in arrived at my replied fat weddings believed prospect.</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.PersonIcon} alt="Learn with Experts" className="w-12 h-12 p-[0.3rem] mb-4 bg-[#E7F6F8] rounded-2xl" />
          <h3 className="text-lg font-bold mb-2">Learn with Experts</h3>
          <p className="text-sm">In no impression assistance contrasted Manners she solving justice healthy new anxious At discovery objection we.</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.ClockIcon} alt="Best Practices" className="w-12 h-12 p-[0.3rem] mb-4 bg-[#E7F6F8] rounded-2xl" />
          <h3 className="text-lg font-bold mb-2">Best Practices</h3>
          <p className="text-sm">Denote simple fat denied add worthy little use as some he help dash am week Conduct denied add worthy little use As.</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.bankIcon} alt="Industrial Standards" className="w-12 h-12 p-[0.3rem] mb-4 bg-[#E7F6F8] rounded-2xl" />
          <h3 className="text-lg font-bold mb-2">Industrial Standards</h3>
          <p className="text-sm">Pleasure and so read the was hope entire first decided the most hear due as were want age of to traveling as.</p>
        </div>
      </div>

      {/* Most Popular Topics Section */}
      <div className="px-10 py-10 bg-gradient-to-r w-full from-[rgba(69,122,238,0)] to-[rgba(0,40,128,1)]">
        <h1 className="font-bold text-gray-800 mb-4 md:text-home-heading-large text-home-heading-small">Most Popular Topics</h1>
        <p className="text-lg text-gray-500 mb-6">Choose from hundreds of topics from specialist organizations</p>
        <div className="relative"> 
        <Slider {...sliderSettings} className="gap-10">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300 w-1/3 h-1/3">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-black">{topic.id}</span>
                <img src={topic.icon} alt={topic.title} className="w-16 h-16 ml-auto" />
              </div>
              <div className={`border-l-4 ${topic.borderColor} px-4`}>
                <h3 className={`text-2xl font-bold mb-2 ${topic.textColor}`}>{topic.title}</h3>
                <p className="text-lg text-gray-600 mb-4 max-w-sm">{topic.description}</p>
              </div>
              <button
                className="text-white font-bold p-3 float-right bg-blue-600 rounded-md"
                onClick={() => navigate(`/course/${topic.id}`)}
              >
                View more
              </button>
            </div>
          ))}
        </Slider>
        </div>
      </div>
    </div>
  );
};

export default Hero;
