import React, { useEffect, useRef, useState } from "react";
import * as mediapipePose from "@mediapipe/pose";
import * as cameraUtils from "@mediapipe/camera_utils";

function CameraStatusMonitor({ setStatus }) {
  const videoRef = useRef(null);
  const [lastDetectionTime, setLastDetectionTime] = useState(Date.now());
  const [frameBrightness, setFrameBrightness] = useState(0);

  useEffect(() => {
    const pose = new mediapipePose.Pose({
      locateFile: (file) => {
        const url = `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mediapipePose.VERSION}/${file}`;
        console.log("Loading WASM file:", url);
        return url;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    let isMounted = true;

    const initializePose = async () => {
      try {
        console.log("Initializing Pose...");
        await pose.initialize();
        console.log("Pose initialized successfully");

        pose.onResults((results) => {
          if (!isMounted) return;
          const hasPerson = !!results.poseLandmarks;
          const currentTime = Date.now();

          if (hasPerson) {
            setLastDetectionTime(currentTime);
          }

          const userOutOfFrame =
            !hasPerson && currentTime - lastDetectionTime > 500;
          setStatus((prev) => ({ ...prev, userOutOfFrame }));
        });

        const camera = new cameraUtils.Camera(videoRef.current, {
          onFrame: async () => {
            if (!isMounted) return;
            await pose.send({ image: videoRef.current });

            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const data = imageData.data;

            let brightness = 0;
            for (let i = 0; i < data.length; i += 4) {
              brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            brightness /= data.length / 4;
            setFrameBrightness(brightness);

            const cameraCovered = brightness < 30;
            setStatus((prev) => ({ ...prev, cameraCovered }));
          },
          width: 640,
          height: 480,
        });
        console.log("Starting camera...");
        await camera.start();
        console.log("Camera started successfully");

        return () => {
          isMounted = false;
          camera.stop();
          pose.close();
        };
      } catch (error) {
        console.error("Camera status monitor failed:", error);
        throw error; // Re-throw to catch in dev tools
      }
    };

    initializePose();

    return () => {
      isMounted = false;
    };
  }, [setStatus, lastDetectionTime]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="border border-gray-300 rounded-lg hidden"
      />
    </div>
  );
}

export default CameraStatusMonitor;
