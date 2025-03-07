import React, { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBook,
  FaClipboardCheck,
  FaCalendarAlt,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
} from "react-icons/fa";

const Profile = () => {
  const [items, setItems] = useState([]);
  const itemsRef = useRef(null);
  const [sortByMarks, setSortByMarks] = useState(null); // null, 'asc', 'desc'
  const [sortByDate, setSortByDate] = useState(null); // null, 'asc', 'desc'
  const [filterDate, setFilterDate] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const addItem = () => {
    const newItems = [
      ...items,
      {
        subject: "Mathematics",
        marks: "85/100",
        date: "2025-03-01",
      },
    ];
    setItems(newItems);

    // Removed scrolling feature
    // setTimeout(() => {
    //   itemsRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, 100); // Small delay to ensure DOM updates
  };

  // Sorting and Filtering Logic
  const getSortedAndFilteredItems = () => {
    let filteredItems = [...items];

    // Filter by date
    if (filterDate) {
      filteredItems = filteredItems.filter((item) => item.date === filterDate);
    }

    // Filter by subject
    if (filterSubject) {
      filteredItems = filteredItems.filter((item) =>
        item.subject.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    // Sort by marks
    if (sortByMarks) {
      filteredItems.sort((a, b) => {
        const marksA = parseInt(a.marks.split("/")[0]);
        const marksB = parseInt(b.marks.split("/")[0]);
        return sortByMarks === "asc" ? marksA - marksB : marksB - marksA;
      });
    }

    // Sort by date
    if (sortByDate) {
      filteredItems.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortByDate === "asc" ? dateA - dateB : dateB - dateB;
      });
    }

    return filteredItems;
  };

  const toggleSortByMarks = () => {
    setSortByMarks((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortByDate(null); // Reset other sort
  };

  const toggleSortByDate = () => {
    setSortByDate((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortByMarks(null); // Reset other sort
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* First Div - Profile Form */}
      <div className="container mx-auto px-4 max-w-3xl mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-black">
          <h1 className="text-2xl font-bold text-black mb-6 text-center flex items-center justify-center">
            <FaUser className="mr-2" /> User Profile
          </h1>
          <div className="space-y-6">
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaUser className="text-black mr-2" />
                Name:
              </label>
              <input
                type="text"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaEnvelope className="text-black mr-2" />
                Email:
              </label>
              <input
                type="email"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaPhone className="text-black mr-2" />
                Phone No:
              </label>
              <input
                type="tel"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaMapMarkerAlt className="text-black mr-2" />
                Address:
              </label>
              <input
                type="text"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaGraduationCap className="text-black mr-2" />
                Class:
              </label>
              <input
                type="text"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Div - Items Section */}
      <div className="w-full px-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-black mb-4 text-center flex items-center justify-center">
            <FaBook className="mr-2" /> Additional Items
          </h2>

          {/* Filter and Sort Section */}
          <div className="mb-6 bg-black p-4 rounded-lg shadow-md border border-black">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Sort by Marks */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSortByMarks}
                  className="flex items-center text-white hover:scale-110 duration-500 transition"
                >
                  <FaClipboardCheck className="mr-1 text-white" />
                  Sort by Marks
                  {sortByMarks === "asc" ? (
                    <FaArrowUp className="ml-1 text-white" />
                  ) : sortByMarks === "desc" ? (
                    <FaArrowDown className="ml-1 text-white" />
                  ) : null}
                </button>
              </div>

              {/* Sort by Date */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSortByDate}
                  className="flex items-center text-white hover:scale-110 duration-500 transition"
                >
                  <FaCalendarAlt className="mr-1 text-white" />
                  Sort by Date
                  {sortByDate === "asc" ? (
                    <FaArrowUp className="ml-1 text-white" />
                  ) : sortByDate === "desc" ? (
                    <FaArrowDown className="ml-1 text-white" />
                  ) : null}
                </button>
              </div>

              {/* Filter by Date */}
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-white" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-white p-1 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              {/* Filter by Subject */}
              <div className="flex items-center space-x-2">
                <FaBook className="text-white" />
                <input
                  type="text"
                  placeholder="Filter by Subject"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="border border-white p-1 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6" ref={itemsRef}>
            {getSortedAndFilteredItems().map((item, index) => (
              <div
                key={index}
                className="h-80 bg-white border-2 border-black p-3 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center"
              >
                <div className="flex items-center mb-1">
                  <FaBook className="text-black mr-1" />
                  <span className="text-sm font-semibold text-black">
                    {item.subject}
                  </span>
                </div>
                <div className="flex items-center mb-1">
                  <FaClipboardCheck className="text-black mr-1" />
                  <span className="text-sm text-black">{item.marks}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-black mr-1" />
                  <span className="text-sm text-black">{item.date}</span>
                </div>
              </div>
            ))}
            <div
              onClick={addItem}
              className="h-80 bg-white border-2 border-black p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              <FaPlus className="text-2xl text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;







==========


// AudioMonitor.jsx
import React, { useEffect, useRef, useState } from "react";
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

  const handleClosePopup = () => {
    setShowPopup(false);
    enterFullScreen();
  };

  const handleConfirmExit = () => {
    setShowPopup(false);
    setHasConfirmedExit(true);
    navigate("/proctor");
  };

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
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-4 w-100 rounded-lg shadow-lg">
            <p className="text-center font-medium">Noise Detected!</p>
            <button
              onClick={() => setIsNoiseDetected(false)}
              className="mt-4 bg-black text-white p-2 rounded w-full hover:scale-110 duration-500 transition"
            >
              Close
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
