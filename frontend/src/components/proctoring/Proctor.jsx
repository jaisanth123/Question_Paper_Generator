import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Proctor = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const checkMediaAccess = async () => {
    try {
      // Check for microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Check for camera access
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true; // Both microphone and camera are accessible
    } catch (error) {
      setErrorMessage("Please allow access to your microphone and camera.");
      return false; // Access denied
    }
  };

  const handleTakeTest = async () => {
    const hasAccess = await checkMediaAccess();
    if (hasAccess) {
      navigate("/test"); // Adjust the path as necessary
    }
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
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}
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
