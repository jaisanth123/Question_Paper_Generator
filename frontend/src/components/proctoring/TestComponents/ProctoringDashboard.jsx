// test-components/ProctoringDashboard.jsx
import React from "react";

function ProctoringDashboard({ status }) {
  return (
    <div className="w-full md:w-1/3">
      {status.multiplePeople && (
        <div className="bg-red-50 p-3 mb-2 rounded-lg text-red-800">
          Error: Multiple people detected!
        </div>
      )}
      {status.noiseDetected && (
        <div className="bg-red-50 p-3 mb-2 rounded-lg text-red-800">
          Warning: Continuous noise detected!
        </div>
      )}
      {status.userOutOfFrame && (
        <div className="bg-red-50 p-3 mb-2 rounded-lg text-red-800">
          Warning: User out of frame!
        </div>
      )}
      {status.cameraCovered && (
        <div className="bg-red-50 p-3 mb-2 rounded-lg text-red-800">
          Warning: Camera is covered!
        </div>
      )}
      {status.suspiciousActivity && (
        <div className="bg-red-50 p-3 mb-2 rounded-lg text-red-800">
          Warning: Suspicious activity detected!
        </div>
      )}

      <div className="mt-5 bg-gray-100 p-4 rounded-lg">
        <p className="mb-2">
          Camera Status:
          <span
            className={
              status.userOutOfFrame || status.cameraCovered
                ? "text-red-600"
                : "text-green-600"
            }
          >
            {status.cameraCovered
              ? " Covered"
              : status.userOutOfFrame
              ? " Offline"
              : " Active"}
          </span>
        </p>
        <p className="mb-2">
          Person Count:
          <span
            className={
              status.multiplePeople ? "text-red-600" : "text-green-600"
            }
          >
            {status.multiplePeople ? " Multiple" : " Single"}
          </span>
        </p>
        <p>
          Audio Status:
          <span
            className={status.noiseDetected ? "text-red-600" : "text-green-600"}
          >
            {status.noiseDetected ? " Noisy" : " Normal"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ProctoringDashboard;
