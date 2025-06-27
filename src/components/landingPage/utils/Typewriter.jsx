import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete && !hasCompleted) {
      setHasCompleted(true);
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, hasCompleted]);

  return <span>{displayedText}</span>;
};

export default Typewriter;
