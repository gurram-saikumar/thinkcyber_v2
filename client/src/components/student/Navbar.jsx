import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import LoginModal from './LoginModal';

const Navbar = () => {
  const location = useLocation(); 
  const [showLogin, setShowLogin] = React.useState(false);

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 md:px-10 lg:px-24 border-b border-gray-300 py-4 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={assets.logo} alt="Logo" className="w-36 lg:w-56 cursor-pointer" />
       </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-12 text-[#747579] font-semibold">
        <a href="#" className="hover:text-blue-600">Home</a>
        <a href="#" className="hover:text-blue-600">About Us</a>
        <a href="#" className="hover:text-blue-600">Contact Us</a>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center border border-gray-300 rounded-md bg-[#F5F7F9] px-4 py-3">
        <input
          type="text"
          placeholder="Search"
          className="outline-none text-sm text-gray-600 flex-grow bg-[#F5F7F9]"
        />
        <button>
          <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
        </button>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        <button>
          <img src={assets.favorite_icon} alt="Favorites" className="w-12 h-12" />
        </button>
        <button>
          <img src={assets.language_icon} alt="Language" className="w-12 h-12" />
        </button>
         <button onClick={() => setShowLogin(true)}>
          <img src={assets.usernew_icon} alt="User" className="w-12 h-12" />
        </button>
        <div className='md:flex hidden items-center gap-5 text-gray-500'>
          {/* {
            user && <>
              <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              | <Link to='/my-enrollments' >My Enrollments</Link>
            </>
          } */}
        </div>
        {/* For Phone Screens */}
        <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
          {/* <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
            <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            | {
              user && <Link to='/my-enrollments' >My Enrollments</Link>
            }
          </div> */}
       
        </div>
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Navbar;