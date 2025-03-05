import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const NavBar = () => {
  return (
    <nav className="bg-white p-4 shadow-lg">
      {/* container to make the width as screen size
      justify between places it in two ends 
      item center will make the element center in with and heignt of the navbar */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black font-bold text-xl">
          Question Paper Generator
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-800 hover:text-black transition">
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-800 hover:text-black transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-800 hover:text-black transition"
          >
            Contact
          </Link>
          <Link
            to="/upload"
            className="bg-black text-white p-2 rounded hover:bg-gray-800 transition"
          >
            Upload PDF
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
