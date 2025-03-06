import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  FaClipboardList,
  FaUserGraduate,
  FaHome,
  FaRegUser,
  FaUser, // Changed FaProfile to FaRegUser
} from "react-icons/fa"; // Import icons

const NavBar = () => {
  return (
    <nav className="bg-black p-4 shadow-lg">
      {/* container to make the width as screen size
      justify between places it in two ends 
      item center will make the element center in with and heignt of the navbar */}
      <div className="container h-10 mx-auto flex justify-between items-center">
        <div className="flex items-center text-white font-bold text-xl">
          <FaClipboardList className="mr-2" /> {/* Icon for Question Paper */}
          Question Paper Generator
        </div>
        <div className="flex space-x-8">
          <Link
            to="/"
            className="text-white hover:scale-110 hover:underline  duration-500 transition"
          >
            <FaHome className="mr-1" /> Home
          </Link>
          <Link
            to="/proctor"
            className="text-white  hover:scale-110 hover:underline duration-500 transition"
          >
            <FaUserGraduate className="mr-1" /> Take Test
          </Link>

          <Link
            to="/upload"
            className="bg-black text-white hover:underline duration-500 hover:scale-110  transition"
          >
            <FaClipboardList className="mr-" /> Upload PDF
          </Link>
          <Link
            to="/profile"
            className="text-white  hover:scale-110 hover:underline duration-500 transition"
          >
            <FaUser className="mr-1" /> Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
