import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/TypeBounce.json';

const SplashAnimation = ({ onComplete = () => {} }) => {  // Add default empty function
  const animationRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete(); // Safe to call now
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50 overflow-y-auto">
      <div className="w-full max-w-[90vw] aspect-[16/9]">
        <Lottie
          lottieRef={animationRef}
          animationData={animationData}
          loop={false}
          autoplay={true}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default SplashAnimation;
