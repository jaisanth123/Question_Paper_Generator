// frontend/src/components/PopupNotification.jsx
import React from "react";

const PopupNotification = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold text-center">{message}</h2>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupNotification;
