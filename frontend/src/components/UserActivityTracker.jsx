// frontend/src/components/UserActivityTracker.jsx
import React, { useEffect, useRef } from "react";

const UserActivityTracker = () => {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("User  is a  back in the viewport");
        } else {
          console.log("User is out of the viewport");
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} style={{ height: "1px" }}>
      {/* Invisible element to track visibility */}
    </div>
  );
};

export default UserActivityTracker;
