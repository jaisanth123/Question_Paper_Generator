// test-components/WebcamMonitor.jsx
import React, { useEffect, useRef } from "react";
import * as cameraUtils from "@mediapipe/camera_utils";
import MultiplePeopleDetector from "./MultiplePersonDetector";
import UserOutOfFrameDetector from "./";
import * as mediapipePose from "@mediapipe/pose";

function WebcamMonitor({ setStatus }) {
  const videoRef = useRef(null);
  const pose = new mediapipePose.Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  useEffect(() => {
    console.log("Initializing MediaPipe Pose...");
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      maxNumPoses: 1,
    });

    pose.onResults((results) => {
      console.log("Pose results received:", results);
      // Handle results...
    });

    const camera = new cameraUtils.Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
    };
  }, [pose]);

  return (
    <div className="relative">
      <video ref={videoRef} className="border border-gray-300 rounded-lg" />
      <MultiplePeopleDetector setStatus={setStatus} />
      <UserOutOfFrameDetector setStatus={setStatus} />
    </div>
  );
}

export default WebcamMonitor;
