// frontend/src/components/PopupNotification.jsx
import React from "react";

const PopupNotification = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold">{message}</h2>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupNotification;
