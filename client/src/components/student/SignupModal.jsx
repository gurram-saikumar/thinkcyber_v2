import React from 'react';
import { assets } from '../../assets/assets';

const SignupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl flex overflow-hidden relative animate-fade-in">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-3xl text-red-500 hover:text-red-700"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Left Side Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#E6F0F9] w-1/2 p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome to our largest community</h2>
          <p className="text-gray-600 mb-6 text-center">Let's learn something new today!</p>
          <img src={assets.Loginbanner} alt="Welcome" className="max-w-xs" />
        </div>
        {/* Right Side Signup Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-10">
          <div className="flex items-center gap-2 mb-6">
            <img src={assets.LoginLogo} alt="ThinkCyber" className="w-44" />
           </div>
          <h3 className="text-2xl font-bold mb-2">Create Account</h3>
          <p className="text-gray-600 mb-6">Nice to see you! Please Create your account.</p>
          <form>
            <label className="block text-gray-700 mb-1 font-semibold">First Name</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500" placeholder="First Name" />
            <label className="block text-gray-700 mb-1 font-semibold">Last Name</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500" placeholder="Last Name" />
            <label className="block text-gray-700 mb-1 font-semibold">Email Address</label>
            <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500" placeholder="Example@gmail.com" />
            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" id="terms" />
              <label htmlFor="terms" className="text-xs text-gray-600">By Signing Up, You Agree To The <a href="#" className="underline text-blue-600">Terms & Conditions</a></label>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-2 rounded font-semibold mb-4">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
