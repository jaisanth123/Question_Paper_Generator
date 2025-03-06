// AudioMonitor.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaVolumeUp, FaTimes } from "react-icons/fa"; // Importing icons
import { Howl } from "howler"; // For audio handling (npm install howler)
import { useNavigate } from "react-router-dom";
import PopupNotification from "../../utils/PopupNotification";
import screenfull from "screenfull";
import { useSpeechRecognition } from "react-speech-recognition";
import "@babel/polyfill";

const SpeechDetector = ({ onAudioUpdate }) => {
  const [isNoiseDetected, setIsNoiseDetected] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasConfirmedExit, setHasConfirmedExit] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [speechDetectedTime, setSpeechDetectedTime] = useState(0);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Microphone related refs and states
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const noiseTimerRef = useRef(null);
  const soundDurationRef = useRef(0);
  const silenceDurationRef = useRef(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState(false);
  const [warningCooldown, setWarningCooldown] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      if (transcript) {
        setIsNoiseDetected(true);
        setSpeechDetectedTime((prev) => prev + 100); // Increment time by 100ms
      } else {
        setIsNoiseDetected(false);
        setSpeechDetectedTime(0); // Reset time if no speech
      }
    }
  }, [transcript, listening]);

  // Initialize microphone
  useEffect(() => {
    const initializeMicrophone = async () => {
      try {
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        micStreamRef.current = stream;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        // Start monitoring audio levels
        setIsMicActive(true);
        monitorAudioLevels();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access for proctoring to work");
      }
    };

    initializeMicrophone();

    // Cleanup function
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (noiseTimerRef.current) {
        clearInterval(noiseTimerRef.current);
      }
    };
  }, []);

  // Function to handle closing the noise warning
  const handleCloseNoiseWarning = () => {
    setIsNoiseDetected(false);
    setWarningCooldown(true);

    // Reset the cooldown after 500ms to prevent rapid warning triggers
    setTimeout(() => {
      setWarningCooldown(false);
    }, 500);
  };

  // Function to monitor audio levels
  const monitorAudioLevels = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudioLevel = () => {
      if (showPopup) return; // Skip monitoring if popup is active

      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      // Update voice level state (0-100 scale)
      const normalizedLevel = Math.floor((average / 256) * 100);
      setVoiceLevel(normalizedLevel);

      // Threshold for noise detection (adjust as needed)
      const noiseThreshold = 15;
      
      if (normalizedLevel > noiseThreshold) {
        // Sound detected
        soundDurationRef.current += 100;
        silenceDurationRef.current = 0;
        setIsCurrentlySpeaking(true);

        // Check if continuous sound for 2 seconds (2000ms)
        if (
          soundDurationRef.current >= 3000 &&
          !isNoiseDetected &&
          !warningCooldown
        ) {
          setIsNoiseDetected(true);
        }
      } else {
        // Silence detected
        if (isCurrentlySpeaking) {
          silenceDurationRef.current += 100;

          // If silence for 1 second (1000ms), reset sound counter
          if (silenceDurationRef.current >= 1000) {
            soundDurationRef.current = 0;
            silenceDurationRef.current = 0;
            setIsCurrentlySpeaking(false);
          }
        }
      }

      requestAnimationFrame(checkAudioLevel);
    };

    // Check audio levels every 100ms
    const intervalId = setInterval(checkAudioLevel, 100);
    noiseTimerRef.current = intervalId;
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Please allow camera access for proctoring to work");
      }
    };

    setupCamera();
  }, []);

  const enterFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request().catch((error) => {
        console.error("Error attempting to enable full-screen mode:", error);
      });
    } else {
      console.error("Full-screen API is not supported.");
    }
  };

  useEffect(() => {
    if (!hasConfirmedExit) {
      enterFullScreen();
    }

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setShowPopup(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowPopup(true);
      }
    };

    const handleWindowBlur = () => {
      setShowPopup(true); // Show popup when window loses focus
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur); // Listen for window blur

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur); // Cleanup
    };
  }, [hasConfirmedExit]);

  useEffect(() => {
    if (speechDetectedTime >= 2000) {
      // If speech is detected for 2 seconds
      setShowPopup(true);
    }
  }, [speechDetectedTime]);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
    enterFullScreen();
  }, []);

  const handleConfirmExit = useCallback(() => {
    setShowPopup(false);
    setHasConfirmedExit(true);
    navigate("/proctor");
  }, [navigate]);

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 p-2">
        <video
          ref={videoRef}
          className="border border-gray-300 rounded-lg w-50 h-38"
          autoPlay
        />
      </div>
      <div className="absolute top-42 right-0 p-2 w-50">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-black h-2.5 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(voiceLevel, 100)}%` }}
          ></div>
        </div>
        <p className="text-center">Voice Level: {voiceLevel}</p>
      </div>
      {isNoiseDetected && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-md">
            <div className="flex items-center justify-center mb-4">
              <FaVolumeUp className="text-red-500 text-2xl mr-3" />
              <p className="text-lg font-semibold">Noise Detected!</p>
            </div>
            <p className="text-center text-gray-600 mb-4">
              Please maintain silence during the test.
            </p>
            <button
              onClick={handleCloseNoiseWarning}
              className="flex items-center justify-center w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 transition duration-300"
            >
              <FaTimes className="mr-2" />
              <span>Acknowledge</span>
            </button>
          </div>
        </div>
      )}
      {showPopup && (
        <PopupNotification
          message="Exiting full-screen mode is not allowed during the test! Do you want to exit?"
          onClose={handleClosePopup}
          onConfirm={handleConfirmExit}
        />
      )}
    </div>
  );
};

export default SpeechDetector;
