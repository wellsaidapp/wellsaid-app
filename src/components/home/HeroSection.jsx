import React from 'react';
import { Plus } from 'lucide-react';

// 🔹 Time-based greeting helper
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const HeroSection = ({ setShowCaptureOptions, userName }) => {
  const greeting = getGreeting(); // ⬅️ Get it once on load

  return (
    <div
      onClick={() => setShowCaptureOptions(true)}
      className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.99]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
      <div className="relative z-10">
        <h1 className="text-xl font-bold mb-3">{greeting}, {userName}!</h1>
        <p className="text-blue-100 text-base leading-relaxed mb-6">
          Use today to <strong>say what matters</strong>, so that it's there when it matters most.
        </p>
        <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full animate-pulse mx-auto mt-4">
          <Plus size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
