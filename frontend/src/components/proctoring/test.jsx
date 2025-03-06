import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpeechDetector from "./TestComponents/SpeechDetector";
import PopupNotification from "../utils/PopupNotification";

function Test() {
  const navigate = useNavigate();
  const [proctoringStatus, setProctoringStatus] = useState({
    noiseDetected: false,
    audioLevel: 0,
    isMonitoring: false,
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleAudioUpdate = (newStatus) => {
    setProctoringStatus((prev) => ({
      ...prev,
      ...newStatus,
    }));
  };

  useEffect(() => {
    // No need to enter full-screen mode here anymore
  }, []);

  return (
    <div className="p-5 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Proctoring System</h1>
      </div>
      <div className="flex flex-col gap-5">
        <SpeechDetector onAudioUpdate={handleAudioUpdate} />
      </div>
      {showPopup && (
        <PopupNotification
          message="Exiting full-screen mode is not allowed during the test!"
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default Test;
