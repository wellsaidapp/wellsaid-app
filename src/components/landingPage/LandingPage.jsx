// Imports
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

// Assets
import logo from '../../assets/wellsaid.svg';
import WellSaidIconLanding from '../../assets/icons/WellSaidIconLanding';

const LandingPage = ({ onGetStarted, onShowLogin }) => {
  const [messages, setMessages] = useState([
    { id: 1, show: false, text: '', typing: false, complete: false, bold: true },
    { id: 2, show: false, text: '', typing: false, complete: false },
    { id: 3, show: false, text: '', typing: false, complete: false }
  ]);
  const [showButton, setShowButton] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const cancelAnimationRef = useRef(false);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Clean typewriter effect without stuttering
  const typewriter = async (messageIndex, text, speed = 50) => {
    return new Promise((resolve) => {
      let currentText = '';
      let i = 0;

      const type = () => {
        if (i < text.length) {
          currentText += text.charAt(i);
          setMessages(prev => prev.map((msg, idx) =>
            idx === messageIndex ? { ...msg, text: currentText } : msg
          ));
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  };

  // Animation sequence
  useEffect(() => {
    const startAnimation = async () => {
      setShowLogo(true);
      await delay(1000);
      if (cancelAnimationRef.current) return;

      setMessages(prev => prev.map((msg, idx) =>
        idx === 0 ? { ...msg, show: true } : msg
      ));
      await typewriter(0, 'Say what matters, to those that matter.', 10);
      if (cancelAnimationRef.current) return;

      await delay(400);

      setMessages(prev => prev.map((msg, idx) =>
        idx === 1 ? { ...msg, show: true } : msg
      ));
      await typewriter(1, 'Share the lessons, perspectives, and values that have shaped you—so they can shape others.', 10);
      if (cancelAnimationRef.current) return;

      await delay(400);

      setMessages(prev => prev.map((msg, idx) =>
        idx === 2 ? { ...msg, show: true } : msg
      ));
      await typewriter(2, 'One thoughtful prompt at a time, you\'re creating a living archive of insight and connection.', 10);
      if (cancelAnimationRef.current) return;

      await delay(800);
      if (cancelAnimationRef.current) return;

      setShowButton(true);
    };

    startAnimation();
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo - using your actual WellSaid logo */}
        <div className={`mb-4 transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center">
            <WellSaidIconLanding size={100} /> {/* Use your actual logo component */}
            <div className="ml-3">
              <img src={logo} alt="WellSaid" className="h-12" /> {/* Use your actual logo image */}
              <p className="text-sm text-gray-500">AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="w-full bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`transition-all duration-500 ease-out ${
                  message.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                {message.text && (
                  <div className={`text-lg leading-relaxed ${message.bold ? 'font-bold' : 'font-medium'}`}>
                    {message.text}
                    {!message.complete && (
                      <span className="border-r-2 border-blue-500 animate-pulse" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl py-5 px-6 text-lg font-semibold shadow-lg transition-all duration-300 ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          } hover:scale-105 hover:shadow-xl active:scale-95`}
        >
          Begin Your Journey <ArrowRight className="inline ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
        {showButton && (
          <button
            onClick={() => {
              cancelAnimationRef.current = true;
              onShowLogin();
            }}
            className="w-full text-blue-600 text-sm font-medium mt-2"
          >
            Already have an account? Log in
          </button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
