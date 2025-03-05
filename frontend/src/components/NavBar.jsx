import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const NavBar = () => {
  return (
    <nav className="bg-black p-4 shadow-lg">
      {/* container to make the width as screen size
      justify between places it in two ends 
      item center will make the element center in with and heignt of the navbar */}
      <div className="container h-10 mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          Question Paper Generator
        </div>
        <div className="flex space-x-8">
          <Link
            to="/"
            className="text-white hover:scale-110 hover:underline  duration-500 transition"
          >
            Home
          </Link>
          <Link
            to="/proctor"
            className="text-white  hover:scale-110 hover:underline duration-500 transition"
          >
            Take Test
          </Link>
          <Link
            to="/contact"
            className="text-white  hover:scale-110 hover:underline duration-500 transition"
          >
            Contact
          </Link>
          <Link
            to="/upload"
            className="bg-black text-white hover:underline duration-500 hover:scale-110  transition"
          >
            Upload PDF
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
