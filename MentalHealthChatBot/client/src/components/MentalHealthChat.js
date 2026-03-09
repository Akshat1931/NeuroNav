import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  MessageCircle,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  HelpCircle,
  X,
  ArrowLeft,
  Delete,
  ChevronsUp,
} from "lucide-react";
import { XIcon } from "@heroicons/react/solid";

// Animated Face Component - Kept from original code
const AnimatedFace = ({ mood = "neutral" }) => {
  const moodConfigs = {
    happy: {
      eyeShape: "rounded-full",
      mouthPath: "M 10 20 Q 25 30 40 20",
      color: "text-yellow-400",
      animation: {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }
    },
    sad: {
      eyeShape: "rounded-full",
      mouthPath: "M 10 25 Q 25 15 40 25",
      color: "text-blue-400",
      animation: {
        scale: [1, 0.9, 1],
        y: [0, 2, 0],
      }
    },
    neutral: {
      eyeShape: "rounded-full",
      mouthPath: "M 10 22 L 40 22",
      color: "text-purple-400",
      animation: {
        scale: [1, 1.05, 1],
      }
    },
    thinking: {
      eyeShape: "rounded-full",
      mouthPath: "M 15 22 Q 25 22 35 22",
      color: "text-green-400",
      animation: {
        rotate: [0, 10, -10, 0],
      }
    }
  };

  const config = moodConfigs[mood];

  return (
    <motion.div
      className={`w-12 h-12 relative ${config.color}`}
      animate={config.animation}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <svg viewBox="0 0 50 50" className="w-full h-full">
        {/* Eyes */}
        <circle cx="15" cy="15" r="3" className={config.eyeShape} fill="currentColor" />
        <circle cx="35" cy="15" r="3" className={config.eyeShape} fill="currentColor" />
        {/* Mouth */}
        <path d={config.mouthPath} stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    </motion.div>
  );
};

// Floating Animation Background - Kept from original code
const FloatingOrb = ({ delay, duration, className }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={`absolute rounded-full blur-2xl ${className}`}
  />
);

// Virtual Keyboard Component - New component
const VirtualKeyboard = ({ inputValue, setInputValue, onClose }) => {
  const [shift, setShift] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);

  // Keyboard layouts
  const keyboardLayouts = {
    main: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ],
    symbols: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['@', '#', '$', '%', '&', '*', '-', '+', '(', ')'],
      ['!', '"', '\'', ':', ';', '/', '?', ',', '.']
    ]
  };

  const currentLayout = showSymbols ? keyboardLayouts.symbols : keyboardLayouts.main;

  const handleKeyPress = (key) => {
    let newKey = key;
    
    if (!showSymbols && (shift || capsLock)) {
      newKey = key.toUpperCase();
    }
    
    setInputValue(inputValue + newKey);
    
    // Turn off shift after a letter is typed
    if (shift) {
      setShift(false);
    }
  };

  const handleBackspace = () => {
    setInputValue(inputValue.slice(0, -1));
  };

  const handleSpace = () => {
    setInputValue(inputValue + ' ');
  };

  const toggleShift = () => {
    setShift(!shift);
  };

  const toggleCapsLock = () => {
    setCapsLock(!capsLock);
  };

  const toggleSymbols = () => {
    setShowSymbols(!showSymbols);
  };

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-t border-purple-500/30 p-2 rounded-t-2xl shadow-lg z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-2 rounded-lg bg-gray-700/50 text-white/80"
        >
          <X className="w-5 h-5" />
        </motion.button>
        <div className="text-white/60 text-sm">Virtual Keyboard</div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSymbols}
            className={`p-2 rounded-lg ${showSymbols ? 'bg-purple-600/80' : 'bg-gray-700/50'} text-white/80`}
          >
            {showSymbols ? 'ABC' : '123'}
          </motion.button>
        </div>
      </div>

      <div className="space-y-2">
        {currentLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {row.map((key) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleKeyPress(key)}
                className="w-12 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 backdrop-blur-md text-white/90 text-xl font-medium flex items-center justify-center border border-white/10 hover:bg-white/20"
              >
                {!showSymbols && (shift || capsLock) ? key.toUpperCase() : key}
              </motion.button>
            ))}
          </div>
        ))}

        <div className="flex justify-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleShift}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${shift ? 'bg-purple-600/80' : 'bg-white/10'} backdrop-blur-md text-white/90 flex items-center justify-center border border-white/10`}
          >
            <ChevronsUp className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCapsLock}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${capsLock ? 'bg-purple-600/80' : 'bg-white/10'} backdrop-blur-md text-white/90 flex items-center justify-center border border-white/10`}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpace}
            className="flex-1 h-14 md:h-16 mx-1 rounded-xl bg-white/10 backdrop-blur-md text-white/60 text-sm flex items-center justify-center border border-white/10 hover:bg-white/20"
          >
            SPACE
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackspace}
            className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center border border-white/10 hover:bg-white/20"
          >
            <Delete className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const MentalHealthChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [error, setError] = useState(null);
  const [canListen, setCanListen] = useState(true);
  const [currentMood, setCurrentMood] = useState("neutral");
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const speakQueueRef = useRef([]);
  const currentUtteranceRef = useRef(null);
  const transcriptRef = useRef("");
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize speech synthesis
      if ("speechSynthesis" in window) {
        speechSynthRef.current = window.speechSynthesis;
      }

      // Initialize speech recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setCurrentMood("thinking");
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setCurrentMood("neutral");
          // Automatically send the recognized speech
          if (inputMessage.trim()) {
            handleSendMessage(inputMessage);
          }
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInputMessage(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setCurrentMood("sad");
          setTimeout(() => setCurrentMood("neutral"), 2000);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hide keyboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showKeyboard && !event.target.closest('.keyboard-area') && !event.target.closest('.input-area')) {
        setShowKeyboard(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showKeyboard]);

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      speakQueueRef.current = [];
    }
  };
  
 const analyzeSentiment = (text) => {
   const positiveWords = [
     "happy",
     "great",
     "awesome",
     "excellent",
     "good",
     "love",
     "wonderful",
   ];
   const negativeWords = [
     "sad",
     "bad",
     "terrible",
     "awful",
     "hate",
     "unfortunate",
     "sorry",
   ];

   const words = text.toLowerCase().split(" ");
   const positiveCount = words.filter((word) =>
     positiveWords.includes(word)
   ).length;
   const negativeCount = words.filter((word) =>
     negativeWords.includes(word)
   ).length;

   if (positiveCount > negativeCount) return "happy";
   if (negativeCount > positiveCount) return "sad";
   return "neutral";
 };

 const speakMessage = async (text) => {
   if (!autoSpeak || !speechSynthRef.current) return;

   return new Promise((resolve) => {
     const utterance = new SpeechSynthesisUtterance(text);
     utterance.onstart = () => {
       setIsSpeaking(true);
       setCurrentMood("happy");
     };
     utterance.onend = () => {
       setIsSpeaking(false);
       setCurrentMood("neutral");
       resolve();
     };
     utterance.onerror = () => {
       setIsSpeaking(false);
       setCurrentMood("sad");
       resolve();
     };
     speechSynthRef.current.speak(utterance);
   });
 };

 const handleSendMessage = async (message) => {
   if (!message.trim() || isSpeaking) return;

   const userMessage = message.trim();
   setInputMessage("");
   setShowKeyboard(false);

   // Add user message and update mood based on sentiment
   const userMood = analyzeSentiment(userMessage);
   setCurrentMood(userMood);

   setMessages((prev) => [
     ...prev,
     {
       type: "user",
       content: userMessage,
       mood: userMood,
     },
   ]);

   setIsTyping(true);
   setCurrentMood("thinking");

   try {
     const response = await fetch("http://localhost:5500/chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         message: userMessage,
         chatHistory: messages,
       }),
     });

     const data = await response.json();
     const botMood = analyzeSentiment(data.response);

     setMessages((prev) => [
       ...prev,
       {
         type: "bot",
         content: data.response,
         mood: botMood,
       },
     ]);

     if (!isSpeaking) {
       await speakMessage(data.response);
     }
   } catch (error) {
     console.error("Error sending message:", error);
     setError("Failed to send message. Please try again.");
     setCurrentMood("sad");
   } finally {
     setIsTyping(false);
     setTimeout(() => setCurrentMood("neutral"), 1000);
   }
 };

 const toggleListening = () => {
   if (!recognitionRef.current) {
     setError("Speech recognition is not supported in your browser.");
     return;
   }

   if (isListening) {
     recognitionRef.current.stop();
   } else {
     setInputMessage("");
     setShowKeyboard(false);
     recognitionRef.current.start();
   }
 };

 const handleInputFocus = () => {
   setShowKeyboard(true);
 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb
          delay={0}
          duration={8}
          className="w-96 h-96 bg-purple-600/10 top-0 -right-20"
        />
        <FloatingOrb
          delay={2}
          duration={10}
          className="w-80 h-80 bg-blue-600/10 bottom-0 -left-20"
        />
        <FloatingOrb
          delay={4}
          duration={12}
          className="w-64 h-64 bg-pink-600/10 top-1/2 right-1/4"
        />
      </div>

      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="p-6 rounded-t-2xl shadow-lg backdrop-blur-xl bg-white/10 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <AnimatedFace mood={currentMood} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  NeuroNav Assistant
                </span>
                <span className="text-sm text-white/60">AI Companion</span>
              </div>
            </motion.div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-3 rounded-full backdrop-blur-md ${
                  autoSpeak
                    ? "bg-green-400/20 text-green-400"
                    : "bg-gray-400/20 text-gray-400"
                }`}
              >
                {autoSpeak ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-full backdrop-blur-md bg-white/10"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-400" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 backdrop-blur-xl bg-white/5 overflow-hidden flex flex-col rounded-b-2xl shadow-lg border border-white/20">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end space-x-3 max-w-[80%] ${
                      message.type === "bot" ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {message.type === "bot" && (
                      <AnimatedFace mood={message.mood} />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`px-6 py-3 rounded-2xl backdrop-blur-md ${
                        message.type === "user"
                          ? "bg-purple-600/80 text-white ml-4"
                          : "bg-white/10 text-white border border-white/10"
                      }`}
                    >
                      <p>{message.content}</p>
                    </motion.div>
                    {message.type === "user" && (
                      <div className="w-8 h-8">
                        <AnimatedFace mood={message.mood} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center space-x-4"
              >
                <AnimatedFace mood="thinking" />
                <div className="flex space-x-2 p-3 bg-white/10 rounded-full">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -6, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div
            className="p-6 border-t border-white/10 input-area"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex space-x-4"
            >
              <motion.div
                className="flex-1 relative"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onFocus={handleInputFocus}
                  placeholder="Type your message..."
                  className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/10"
                />
                {/* Input Glow Effect */}
                <motion.div
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              {/* Microphone Button with Ripple Effect */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={toggleListening}
                disabled={isSpeaking}
                className={`p-4 rounded-xl relative overflow-hidden ${
                  isListening
                    ? "bg-red-500/80 hover:bg-red-600/80"
                    : isSpeaking
                    ? "bg-gray-600/50 cursor-not-allowed"
                    : "bg-purple-500/80 hover:bg-purple-600/80"
                } text-white backdrop-blur-md border border-white/10`}
              >
                {isListening && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      scale: [1, 2],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
                {isListening ? (
                  <MicOff className="w-6 h-6 relative z-10" />
                ) : (
                  <Mic className="w-6 h-6 relative z-10" />
                )}
              </motion.button>

              {/* Send Button with Pulse Effect */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSpeaking || !inputMessage.trim()}
                className={`p-4 rounded-xl relative ${
                  isSpeaking || !inputMessage.trim()
                    ? "bg-gray-600/50 cursor-not-allowed"
                    : "bg-purple-500/80 hover:bg-purple-600/80"
                } text-white backdrop-blur-md border border-white/10`}
              >
                {inputMessage.trim() && !isSpeaking && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    animate={{
                      scale: [1, 1.1],
                      opacity: [0.2, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}
                <Send className="w-6 h-6 relative z-10" />
              </motion.button>
            </form>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-200 text-sm flex items-center justify-between"
                >
                  <p>{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setError(null)}
                    className="text-red-200 hover:text-red-100"
                  >
                    <XIcon className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Virtual Keyboard */}
      <AnimatePresence>
        {showKeyboard && (
          <div className="keyboard-area">
            <VirtualKeyboard 
              inputValue={inputMessage} 
              setInputValue={setInputMessage} 
              onClose={() => setShowKeyboard(false)} 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentalHealthChat;