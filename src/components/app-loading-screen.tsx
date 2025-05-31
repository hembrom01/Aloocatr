
"use client";

import type { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AppLoadingScreenProps {
  isAppActuallyLoaded: boolean;
  onLoadingFinished: () => void;
}

export const AppLoadingScreen: FC<AppLoadingScreenProps> = ({ isAppActuallyLoaded, onLoadingFinished }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const screenFadeOutDuration = 700; // ms, matches CSS transition

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
        isFadingOut ? "opacity-0 duration-700" : "opacity-100 duration-300" // Control fade in/out of the whole screen
      )}
      style={{ pointerEvents: isFadingOut ? 'none' : 'auto' }}
    >
      <div 
        className="relative text-center animate-loading-content-appear"
        style={{ transform: 'translateY(-50px)' }} // Moved logo and spinner container further up
      >
        <div className="font-logoScript text-5xl text-primary mb-6">Allocatr</div>
        <div className="h-8"> {/* Container to prevent layout shift */}
          {!isFadingOut && ( // Only show spinner if screen is not fading out
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto transition-opacity duration-300 opacity-100" />
          )}
        </div>
      </div>
    </div>
  );
};
