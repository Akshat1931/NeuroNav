import React, { Suspense } from "react";
import MentalHealthChat from "./components/MentalHealthChat";
import WaveDesign from "./components/WaveDesign";

// Lazy load SignLang to avoid breaking the chatbot
const SignLang = React.lazy(() => import("./components/SignLang"));

const App = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <MentalHealthChat />
      <WaveDesign />
      {/* Wrap SignLang in Suspense to handle loading errors */}
      <Suspense fallback={<div className="text-white">Loading Sign Language Module...</div>}>
        <SignLang />
      </Suspense>
    </div>
  );
};

export default App;
