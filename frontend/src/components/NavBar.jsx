import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  FaClipboardList,
  FaUserGraduate,
  FaHome,
  FaRegUser,
  FaUser,
  FaBars, // Import hamburger icon
} from "react-icons/fa"; // Import icons
import Sidebar from "./utils/Sidebar"; // Import Sidebar component

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-black p-4 shadow-lg">
      {/* Removed container class to allow full width */}
      <div className="w-full h-10 flex justify-between items-center">
        <div className="flex items-center text-white">
          {/* Moved FaBars outside the text div and removed mr-2 */}
          <FaBars onClick={toggleSidebar} className="cursor-pointer mr-4" />
          <span className="font-bold text-xl">Question Paper Generator</span>
        </div>
        <div className="flex space-x-8 mr-4">
          <Link
            to="/"
            className="text-white hover:scale-110 hover:underline duration-500 transition"
          >
            <FaHome className="mr-1 inline" /> Home
          </Link>
          <Link
            to="/proctor"
            className="text-white hover:scale-110 hover:underline duration-500 transition"
          >
            <FaUserGraduate className="mr-1 inline" /> Take Test
          </Link>

          <Link
            to="/upload"
            className="text-white hover:underline duration-500 hover:scale-110 transition"
          >
            <FaClipboardList className="mr-1 inline" /> Upload PDF
          </Link>
          <Link
            to="/profile"
            className="text-white hover:scale-110 hover:underline duration-500 transition"
          >
            <FaUser className="mr-1 inline" /> Profile
          </Link>
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </nav>
  );
};

export default NavBar;
