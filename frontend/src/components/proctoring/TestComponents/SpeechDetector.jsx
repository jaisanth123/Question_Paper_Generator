// AudioMonitor.jsx
import React, { useState, useEffect } from "react";
import { Howl } from "howler"; // For audio handling (npm install howler)

const SpeechDetector = () => {
  const [isNoiseDetected, setIsNoiseDetected] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    let audioContext;
    let analyser;
    let microphone;
    let animationFrame;

    const setupAudio = async () => {
      try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);

        // Connect microphone to analyser
        microphone.connect(analyser);
        analyser.fftSize = 256;

        // Audio analysis
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkAudioLevel = () => {
          analyser.getByteFrequencyData(dataArray);

          // Calculate average audio level
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);

          // Threshold for noise detection (adjust as needed)
          if (average > 30) {
            setIsNoiseDetected(true);
          } else {
            setIsNoiseDetected(false);
          }

          animationFrame = requestAnimationFrame(checkAudioLevel);
        };

        setIsMonitoring(true);
        checkAudioLevel();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access for proctoring to work");
      }
    };

    setupAudio();

    // Cleanup
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (microphone) microphone.disconnect();
      if (analyser) analyser.disconnect();
      if (audioContext) audioContext.close();
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Proctoring Audio Monitor
        </h2>

        {/* Microphone Status */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isMonitoring ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-gray-600">
              {isMonitoring ? "Microphone Active" : "Microphone Inactive"}
            </span>
          </div>
        </div>

        {/* Audio Level Visualization */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(audioLevel, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Current Audio Level: {Math.round(audioLevel)}
          </p>
        </div>

        {/* Warning Message */}
        {isNoiseDetected && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded animate-pulse">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-medium">
                Warning: Noise detected! Please maintain silence.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-600">
          <p>This system monitors audio levels during your exam.</p>
          <p>Please ensure your microphone is enabled and working.</p>
        </div>
      </div>
    </div>
  );
};

export default SpeechDetector;
