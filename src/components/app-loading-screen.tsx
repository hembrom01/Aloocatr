
"use client";

import type { FC } from 'react';
// import { Loader2 } from 'lucide-react'; // Removed Loader2
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AppLoadingScreenProps {
  isAppActuallyLoaded: boolean;
  onLoadingFinished: () => void;
}

export const AppLoadingScreen: FC<AppLoadingScreenProps> = ({ isAppActuallyLoaded, onLoadingFinished }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const screenFadeOutDuration = 100; // ms, reduced from 700

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout;
    if (isAppActuallyLoaded && !isFadingOut) {
      // Once app is loaded, start fading out the screen
      setIsFadingOut(true);
      fadeOutTimer = setTimeout(() => {
        setIsAnimationComplete(true);
        onLoadingFinished();
      }, screenFadeOutDuration);
    }
    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, [isAppActuallyLoaded, isFadingOut, onLoadingFinished, screenFadeOutDuration]);

  if (isAnimationComplete && isFadingOut) {
    return null; // Completely remove from DOM after fade out
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity ease-in-out",
        isFadingOut ? "opacity-0 duration-100" : "opacity-100 duration-300" // Changed duration-700 to duration-100 for fade-out
      )}
      style={{ pointerEvents: isFadingOut ? 'none' : 'auto' }}
    >
      <div 
        className="relative text-center animate-loading-content-appear"
        style={{ transform: 'translateY(-50px)' }} 
      >
        <div className="font-sans text-5xl font-semibold text-primary mb-6">Allocatr</div>
        {/* Removed Loader2 icon and its container div */}
      </div>
    </div>
  );
};
