import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">

        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="logo" className="w-32" />
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            ThinkCyber education, built specifically for the education centers which is dedicated to teaching and involving learners.
          </p>
          <div className="flex gap-4 mt-4">
            <img src={assets.instagram_icon} alt="Instagram" className="w-10 h-10 bg-white p-0 rounded-full" />
            <img src={assets.twitter_icon} alt="Twitter" className="w-10 h-10 bg-white p-0 rounded-full" />
            <img src={assets.facebook_icon} alt="LinkedIn" className="w-10 h-10 bg-white p-0 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">News and Blogs</a></li>
          </ul>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Community</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#">Documentation</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Contact</h2>
          <p className="text-sm text-white/80">Toll free: +1234 568 963<br />(9 AM to 8 PM IST)</p>
          <p className="text-sm text-white/80">Email: example@gmail.com</p>
          <div className="flex gap-4 mt-4">
            <img src={assets.google_play_icon} alt="Google Play" />
            <img src={assets.app_store_icon} alt="App Store" />
          </div>
        </div>

      </div>
      <div className="flex flex-col md:flex-row justify-between items-center py-4 text-xs md:text-sm text-white/60">
        <p>Copyrights ©2025 ThinkCyber.</p>
        <div className="flex gap-4">
           <a href="#">Terms of use</a>
          <a href="#">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
