// Test.jsx
import React, { useState } from "react";
import SpeechDetector from "./TestComponents/SpeechDetector";

function Test() {
  const [proctoringStatus, setProctoringStatus] = useState({
    noiseDetected: false,
    audioLevel: 0,
    isMonitoring: false,
  });

  const handleAudioUpdate = (newStatus) => {
    setProctoringStatus((prev) => ({
      ...prev,
      ...newStatus,
    }));
  };

  return (
    <div className="p-5 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Proctoring System</h1>
        {/* Audio Level Bar at Top Right */}
        <div className="w-48 bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(proctoringStatus.audioLevel, 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <SpeechDetector onAudioUpdate={handleAudioUpdate} />
      </div>
    </div>
  );
}

export default Test;
