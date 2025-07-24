// Imports
import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, ArrowRight, Pencil, Zap, Clock,
  Sparkles, Calendar
} from 'lucide-react';

const CaptureOptionsModal = ({
  setShowCaptureOptions,
  setCurrentView,
  setCaptureMode,
  setSelectedOccasion,
  setQuestionSet,
  setCurrentQuestion,
  setCurrentQuestionIndex,
}) => {

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">How would you like to capture today?</h2>
        <p className="text-gray-600 text-center mb-8">Choose the experience that fits</p>

        <div className="space-y-4">
          {/* Insight Builder Option */}
          <button
            onClick={() => {
              setCaptureMode('insight');
              setShowCaptureOptions(false);
              setCurrentView('capture');
            }}
            className="w-full bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Lightbulb size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Insight Builder</h3>
                  <p className="text-green-100 text-sm">Start with an idea</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/70" />
            </div>
            <p className="text-green-100 text-sm leading-relaxed mb-2">
              Begin with your raw thoughts and let the AI help shape them into meaningful takeaways
            </p>
            <div className="flex items-center text-green-100 text-xs">
              <Pencil size={14} className="mr-1" />
              <span>10-15 minutes</span>
            </div>
          </button>

          {/* Quick Capture Option */}
          <button
            onClick={() => {
              setCaptureMode('quick');
              setShowCaptureOptions(false);
              setCurrentView('capture');
            }}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Capture</h3>
                  <p className="text-blue-100 text-sm">Thoughtful prompts</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/70" />
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-2">
              Answer 1-2 thoughtful questions to quickly capture what's on your mind
            </p>
            <div className="flex items-center text-blue-100 text-xs">
              <Clock size={14} className="mr-1" />
              <span>5-10 minutes</span>
            </div>
          </button>

          {/* Special Occasion Option */}
          <button
            onClick={() => {
              const defaultOccasion = {
                name: 'Special Occasion',
                type: 'custom',
                date: null
              };

              setSelectedOccasion(defaultOccasion); // ✅ set something useful
              setCurrentQuestionIndex(0);
              setCaptureMode('milestone');
              setShowCaptureOptions(false);
              setCurrentView('specialOccasionSelectPerson');
            }}
            className="w-full bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Special Occasion</h3>
                  <p className="text-purple-100 text-sm">Deep & comprehensive</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/70" />
            </div>
            <p className="text-purple-100 text-sm leading-relaxed mb-2">
              Prepare meaningful insights for upcoming milestones, celebrations, or life events
            </p>
            <div className="flex items-center text-purple-100 text-xs">
              <Calendar size={14} className="mr-1" />
              <span>20-45 minutes</span>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowCaptureOptions(false)}
          className="w-full mt-6 py-3 text-gray-500 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CaptureOptionsModal;
