// frontend/src/components/UserActivityTracker.jsx
import React, { useEffect, useRef, useState } from "react";
import PopupNotification from "./PopupNotification";

const UserActivityTracker = () => {
  const ref = useRef();
  const [isTabActive, setIsTabActive] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("User switched to another tab or minimized the window");
        //alert("Switching tabs is not allowed during this session!");
        setIsTabActive(false); // Disable functionality
        handleSubmit(); // Trigger submit action
      } else {
        console.log("User is back in the viewport");
        setIsTabActive(true); // Enable functionality
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("User is back in the viewport");
        } else {
          console.log("User is out of the viewport");
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    // Observe the ref element
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Bind visibility change event
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on component unmount
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleSubmit = () => {
    console.log("Test submitted");
    setShowPopup(true); // Show the popup notification
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <div ref={ref} style={{ height: "1px" }}>
      {/* Invisible element to track visibility */}
      {showPopup && (
        <PopupNotification message="Test submitted!" onClose={closePopup} />
      )}
      {/* <button
        disabled={!isTabActive}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button> */}
    </div>
  );
};

export default UserActivityTracker;
