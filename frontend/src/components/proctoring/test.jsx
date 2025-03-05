// @test.jsx
import React, { useState } from "react";
import MultiplePersonDetector from "./TestComponents/MultiplePersonDetector";
import CameraStatusMonitor from "./TestComponents/CameraStatusMonitor";
import AudioMonitor from "./TestComponents/AudioMonitor";
import ProctoringDashboard from "./TestComponents/ProctoringDashboard";

function Test() {
  const [proctoringStatus, setProctoringStatus] = useState({
    multiplePeople: false,
    noiseDetected: false,
    userOutOfFrame: false,
    cameraCovered: false,
    suspiciousActivity: false,
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Proctoring System</h1>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex flex-col gap-5">
          <MultiplePersonDetector setStatus={setProctoringStatus} />
          <CameraStatusMonitor setStatus={setProctoringStatus} />
          <AudioMonitor setStatus={setProctoringStatus} />
        </div>
        <ProctoringDashboard status={proctoringStatus} />
      </div>
    </div>
  );
}

export default Test;
