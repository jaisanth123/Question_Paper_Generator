import React from "react";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      {/* container to make the width as screen size
      justify between places it in two ends 
      item center will make the element center in with and heignt of the navbar */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold  text-xl">
          Question Paper Generator
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
