import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-left bg-gradient-to-b from-cyan-100/70">
      <h6 className="md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-10">
        LEADING THE WAY 
       </h6>
      <p className="md:block hidden text-gray-500 max-w-full mx-10">
        Our company provides top-quality knowledge on digital and cyber security that can help to meet the needs of people – which can be
        different audience. We have a proven track record of success in the industry and are committed to exceeding expectations. With a team of experienced professionals and cutting-edge technology,
        we are well-equipped to deliver results that matter.
      </p>
      <p className="md:block  text-gray-500 max-w-full mx-10">
      In today's fast-paced business environment, it's essential to stay ahead on security. That's why our company is always looking for ways to innovate and improve our products and services.      </p>
     {/* Cards Section */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-10 py-10">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.basic_learning_icon} alt="Basic Learning" className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold mb-2">Basic Learning</h3>
          <p className="text-sm">Smiles spoke total few great had never their too. Amongst moments do in arrived at my replied fat weddings believed prospect.</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.learn_with_experts_icon} alt="Learn with Experts" className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold mb-2">Learn with Experts</h3>
          <p className="text-sm">In no impression assistance contrasted Manners she solving justice healthy new anxious At discovery objection we.</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.best_practices_icon} alt="Best Practices" className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold mb-2">Best Practices</h3>
          <p className="text-sm">Denote simple fat denied add worthy little use as some he help dash am week Conduct denied add worthy little use As.</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <img src={assets.industrial_standards_icon} alt="Industrial Standards" className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold mb-2">Industrial Standards</h3>
          <p className="text-sm">Pleasure and so read the was hope entire first decided the most hear due as were want age of to traveling as.</p>
        </div>
      </div>

      {/* Most Popular Topics Section */}
      <div className="px-10 py-10 bg-gradient-to-r w-full from-[rgba(69,122,238,0)] to-[rgba(0,40,128,1)]">
        <h1 className="text-xl font-bold text-gray-800 mb-4 md:text-home-heading-large text-home-heading-small">Most Popular Topics</h1>
        <p className="text-sm text-gray-500 mb-6">Choose from hundreds of topics from specialist organizations</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-blue-600">01</span>
              <img src={assets.basic_security_icon} alt="Basic Security" className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold mb-2">Basic Security</h3>
            <p className="text-sm text-gray-600 mb-4">Basic security principles revolve around protecting information</p>
            <button className="text-blue-600 font-bold">View more</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-blue-600">02</span>
              <img src={assets.business_owner_icon} alt="Business Owner" className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold mb-2">Business Owner</h3>
            <p className="text-sm text-gray-600 mb-4">What does a business owner need to know</p>
            <button className="text-blue-600 font-bold">View more</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-blue-600">03</span>
              <img src={assets.mobile_end_user_icon} alt="Mobile End User" className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold mb-2">Mobile End User</h3>
            <p className="text-sm text-gray-600 mb-4">Mobile end-user security refers to the measures</p>
            <button className="text-blue-600 font-bold">View more</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
