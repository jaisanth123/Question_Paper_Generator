// frontend/src/components/PopupNotification.jsx
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const PopupNotification = ({ message, onClose, onConfirm }) => {
  const [timer, setTimer] = useState(10); // Timer state

  useEffect(() => {
    // Start the timer
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          onConfirm(); // Automatically confirm when timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown); // Cleanup on unmount
  }, [onConfirm]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white border-2 border-black p-6 rounded-lg shadow-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-96">
        <h2 className="text-lg font-bold text-center">{message}</h2>
        <p className="text-center mt-2">Auto-closing in {timer} seconds...</p>
        <div className="flex justify-between mt-4">
          <button
            onClick={onConfirm}
            className="bg-black text-white p-2 rounded w-full hover:scale-110 duration-500 mr-5 transition flex items-center justify-center"
          >
            <FaCheck className="mr-2" /> Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-black text-white p-2 rounded w-full hover:scale-110 duration-500 transition flex items-center justify-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupNotification;
