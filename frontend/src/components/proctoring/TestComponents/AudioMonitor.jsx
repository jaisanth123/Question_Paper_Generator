// test-components/AudioMonitor.jsx
import React, { useEffect, useState } from "react";

function AudioMonitor({ setStatus }) {
  const [noiseStartTime, setNoiseStartTime] = useState(null);

  useEffect(() => {
    let audioContext;
    let analyser;
    let microphone;

    async function setupAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function checkNoise() {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;

          if (average > 50) {
            if (!noiseStartTime) {
              setNoiseStartTime(Date.now());
            } else if (Date.now() - noiseStartTime > 5000) {
              setStatus((prev) => ({ ...prev, noiseDetected: true }));
            }
          } else {
            setNoiseStartTime(null);
            setStatus((prev) => ({ ...prev, noiseDetected: false }));
          }

          requestAnimationFrame(checkNoise);
        }

        checkNoise();
      } catch (err) {
        console.error("Audio monitoring error:", err);
        alert("Please allow microphone access for audio monitoring.");
      }
    }

    setupAudio();

    return () => {
      if (audioContext) audioContext.close();
    };
  }, [setStatus, noiseStartTime]);

  return null;
}

export default AudioMonitor;
