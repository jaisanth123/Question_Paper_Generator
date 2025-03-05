import React, { useEffect, useRef, useState } from "react";
import * as mediapipePose from "@mediapipe/pose";
import * as cameraUtils from "@mediapipe/camera_utils";

function MultiplePersonDetector({ setStatus }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [poseInstances] = useState(() =>
    Array(2)
      .fill()
      .map((_, index) => {
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
          minDetectionConfidence: 0.6 + index * 0.1,
          minTrackingConfidence: 0.6,
          maxNumPoses: 1,
        });
        return pose;
      })
  );

  useEffect(() => {
    let isMounted = true;

    const initializePoses = async () => {
      try {
        console.log("Initializing Pose instances...");
        await Promise.all(
          poseInstances.map(async (pose) => {
            await pose.initialize();
            console.log("Pose instance initialized");
          })
        );
        console.log("All Pose instances initialized successfully");

        let detectedPersons = 0;

        poseInstances.forEach((pose, index) => {
          pose.onResults((results) => {
            if (!isMounted) return;
            if (results.poseLandmarks) {
              detectedPersons++;
            }

            if (index === poseInstances.length - 1) {
              const multiplePeople = detectedPersons > 1;
              setStatus((prev) => ({ ...prev, multiplePeople }));
              detectedPersons = 0;

              const canvasCtx = canvasRef.current?.getContext("2d");
              if (canvasCtx) {
                canvasCtx.clearRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );
                poseInstances.forEach((p) => {
                  if (p.results?.poseLandmarks) {
                    drawLandmarks(canvasCtx, p.results.poseLandmarks);
                  }
                });
              }
            }
          });
        });

        const camera = new cameraUtils.Camera(videoRef.current, {
          onFrame: async () => {
            if (!isMounted) return;
            await Promise.all(
              poseInstances.map((pose) =>
                pose.send({ image: videoRef.current })
              )
            );
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
          poseInstances.forEach((pose) => pose.close());
        };
      } catch (error) {
        console.error("Error initializing pose instances:", error);
        throw error; // Re-throw to catch in dev tools
      }
    };

    initializePoses();

    return () => {
      isMounted = false;
    };
  }, [setStatus, poseInstances]);

  const drawLandmarks = (ctx, landmarks) => {
    ctx.fillStyle = "red";
    landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(landmark.x * 640, landmark.y * 480, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  return (
    <div className="relative">
      <video ref={videoRef} className="border border-gray-300 rounded-lg" />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="border border-gray-300 rounded-lg absolute top-0 left-0"
      />
    </div>
  );
}

export default MultiplePersonDetector;
