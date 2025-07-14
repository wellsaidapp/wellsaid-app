import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/TypeBounce.json'; // Update path if needed

const SplashAnimation = ({ onComplete }) => {
  const animationRef = useRef();

  useEffect(() => {
    // Optional: wait for animation duration or when animation completes
    const timeout = setTimeout(() => {
      onComplete();
    }, 3000); // Adjust this duration to match your animation length

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
