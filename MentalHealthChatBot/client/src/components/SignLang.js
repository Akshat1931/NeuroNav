import React, { useState, useRef, useEffect } from "react";
import * as handpose from '@tensorflow-models/handpose';
import { Camera } from "lucide-react";

const SignLang = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [detectedSign, setDetectedSign] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);

  const signs = {
    'HELLO': {
      description: 'Open palm with all fingers spread (like high five)',
      check: (landmarks) => {
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        
        const fingersUp = 
          thumbTip[1] < wrist[1] - 30 && 
          indexTip[1] < wrist[1] - 30 && 
          middleTip[1] < wrist[1] - 30 && 
          ringTip[1] < wrist[1] - 30 && 
          pinkyTip[1] < wrist[1] - 30;
        
        const fingerSpread = 
          Math.abs(indexTip[0] - thumbTip[0]) > 20 &&
          Math.abs(middleTip[0] - indexTip[0]) > 20 &&
          Math.abs(ringTip[0] - middleTip[0]) > 20 &&
          Math.abs(pinkyTip[0] - ringTip[0]) > 20;
        
        return fingersUp && fingerSpread;
      }
    },
    'YES': {
      description: 'Closed fist (all fingers folded)',
      check: (landmarks) => {
        const wrist = landmarks[0];
        const thumbKnuckle = landmarks[2];
        const indexKnuckle = landmarks[5]; 
        const middleKnuckle = landmarks[9];
        const ringKnuckle = landmarks[13];
        const pinkyKnuckle = landmarks[17];
        
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        
        const fingersClosedY = 
          Math.abs(thumbTip[1] - thumbKnuckle[1]) < 40 &&
          Math.abs(indexTip[1] - indexKnuckle[1]) < 40 &&
          Math.abs(middleTip[1] - middleKnuckle[1]) < 40 &&
          Math.abs(ringTip[1] - ringKnuckle[1]) < 40 &&
          Math.abs(pinkyTip[1] - pinkyKnuckle[1]) < 40;
        
        const fingersClosedX = 
          Math.abs(thumbTip[0] - wrist[0]) < 70 &&
          Math.abs(indexTip[0] - wrist[0]) < 70 &&
          Math.abs(middleTip[0] - wrist[0]) < 70 &&
          Math.abs(ringTip[0] - wrist[0]) < 70 &&
          Math.abs(pinkyTip[0] - wrist[0]) < 70;
          
        return fingersClosedY && fingersClosedX;
      }
    },
    'NO': {
      description: 'Thumbs down gesture',
      check: (landmarks) => {
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        
        const thumbDown = thumbTip[1] > wrist[1] + 30;
        
        const fingersFolded = 
          Math.abs(indexTip[1] - wrist[1]) < 50 &&
          Math.abs(middleTip[1] - wrist[1]) < 50 &&
          Math.abs(ringTip[1] - wrist[1]) < 50 &&
          Math.abs(pinkyTip[1] - wrist[1]) < 50;
        
        return thumbDown && fingersFolded;
      }
    }
  };

  useEffect(() => {
    if (isOpen && !model) {
      loadHandposeModel();
    }

    return () => {
      cleanupResources();
    };
  }, [isOpen, model]);

  useEffect(() => {
    if (canvasRef.current && isActive) {
      initializeCanvas();
    }
  }, [canvasRef, isActive]);

  useEffect(() => {
    window.addEventListener('resize', initializeCanvas);
    return () => {
      window.removeEventListener('resize', initializeCanvas);
    };
  }, []);

  const loadHandposeModel = async () => {
    setModelLoading(true);
    try {
      const loadedModel = await handpose.load({
        detectionConfidence: 0.8,
        scoreThreshold: 0.5
      });
      setModel(loadedModel);
      setModelLoading(false);
    } catch (error) {
      console.error("Error loading handpose model:", error);
      setModelLoading(false);
    }
  };

  const startVideo = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            initializeCanvas();
            detectSigns();
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setDebugInfo("Camera error: " + error.message);
      }
    }
  };

  const cleanupResources = () => {
    if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const initializeCanvas = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
  };

  const detectSigns = async () => {
    if (!isActive || !model || !videoRef.current || !canvasRef.current) {
      requestIdRef.current = requestAnimationFrame(detectSigns);
      return;
    }

    try {
      if (videoRef.current.readyState === 4) {
        const hands = await model.estimateHands(videoRef.current);
        
        if (hands.length > 0) {
          const landmarks = hands[0].landmarks;
          
          drawHand(landmarks);
          
          let detected = false;
          for (const [sign, config] of Object.entries(signs)) {
            if (config.check(landmarks)) {
              setDetectedSign(sign);
              detected = true;
              break;
            }
          }
          
          if (!detected) {
            setDetectedSign("");
          }
          
          setDebugInfo(`Hand detected: ${hands.length}, Score: ${hands[0].handInViewConfidence.toFixed(2)}`);
        } else {
          clearCanvas();
          setDetectedSign("");
          setDebugInfo("No hands detected");
        }
      }
    } catch (error) {
      console.error('Error in sign detection:', error);
      setDebugInfo("Detection error: " + error.message);
    }

    requestIdRef.current = requestAnimationFrame(detectSigns);
  };

  const drawHand = (landmarks) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#7337d6';
    ctx.lineWidth = 2;
    
    const fingers = [
      [0, 1, 2, 3, 4],
      [0, 5, 6, 7, 8],
      [0, 9, 10, 11, 12],
      [0, 13, 14, 15, 16],
      [0, 17, 18, 19, 20]
    ];
    
    fingers.forEach(finger => {
      for (let i = 1; i < finger.length; i++) {
        const point1 = landmarks[finger[i - 1]];
        const point2 = landmarks[finger[i]];
        
        ctx.beginPath();
        ctx.moveTo(point1[0], point1[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
      }
    });

    ctx.fillStyle = '#ffffff';
    landmarks.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#ffff00';
      ctx.font = '10px Arial';
      ctx.fillText(index.toString(), point[0] + 10, point[1] - 10);
      ctx.fillStyle = '#ffffff';
    });
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const toggleSignLanguage = () => {
    setIsOpen(!isOpen);
    
    if (isOpen) {
      setIsActive(false);
      cleanupResources();
    }
  };

  const toggleDetection = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    
    if (newActive) {
      startVideo();
    } else {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
      setDetectedSign("");
      clearCanvas();
    }
  };

  return (
    <div className="fixed bottom-20 right-5 z-50">
      <button
        onClick={toggleSignLanguage}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      >
        <Camera size={24} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-80 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Sign Language Detector</h3>
            
            <button
              onClick={toggleDetection}
              disabled={modelLoading}
              className={`px-3 py-1 rounded text-white flex items-center gap-1 ${
                isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isActive ? (
                <>
                  <span className="text-sm">Stop</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Start</span>
                </>
              )}
            </button>
          </div>
          
          {modelLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-2 text-sm text-gray-600">Loading model...</p>
            </div>
          ) : (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden mb-3 h-56">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                ></video>
                <canvas
                  ref={canvasRef}
                  className={`absolute top-0 left-0 w-full h-full ${!isActive ? 'hidden' : ''}`}
                ></canvas>
              </div>
              
              <div className="bg-gray-100 rounded p-3">
                <div className="font-medium mb-1">Detected Sign:</div>
                {detectedSign ? (
                  <>
                    <div className="text-lg font-bold text-indigo-700">{detectedSign}</div>
                    <div className="text-sm text-gray-600">
                      {signs[detectedSign]?.description || ""}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">No sign detected</div>
                )}
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                {debugInfo}
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Position your hand clearly in front of the camera
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SignLang;