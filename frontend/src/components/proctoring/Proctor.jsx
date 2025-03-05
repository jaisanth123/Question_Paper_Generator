import React from "react";
import { useNavigate } from "react-router-dom";

const Proctor = () => {
  const navigate = useNavigate();

  const handleTakeTest = () => {
    navigate("/test"); // Adjust the path as necessary
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">Exam Details</h2>
        <p className="text-black mb-2">
          <strong>Timing:</strong> 60 minutes
        </p>
        <p className="text-black mb-2">
          <strong>Instructions:</strong> Please read all questions carefully.
        </p>
        <p className="text-black mb-2">
          <strong>Maximum Marks:</strong> 100
        </p>
        <button
          onClick={handleTakeTest}
          className="mt-4 bg-black text-white text-xl p-3 rounded w-full hover:scale-110 duration-500 transition"
        >
          Take Test
        </button>
      </div>
    </div>
  );
};

export default Proctor;
