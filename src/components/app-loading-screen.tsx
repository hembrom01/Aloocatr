
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
  const [phase, setPhase] = useState<'typing' | 'fadingLoader' | 'fadingScreen' | 'finished'>('typing');
  const appName = "Allocatr";
  // Adjusted typewriter duration for better feel
  const typewriterCharDuration = 100; // ms per character
  const typewriterTotalDuration = appName.length * typewriterCharDuration;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === 'typing') {
      // Duration for typing text + a slight pause after
      timer = setTimeout(() => setPhase('fadingLoader'), typewriterTotalDuration + 300);
    } else if (phase === 'fadingLoader') {
      // Duration for loader to be visible or start fading
      timer = setTimeout(() => {
        if (isAppActuallyLoaded) {
          setPhase('fadingScreen'); // Start fading screen if app is loaded
        }
        // If app not loaded, this phase will persist due to isAppActuallyLoaded in JSX
      }, 500); // How long loader stays or fades
    } else if (phase === 'fadingScreen') {
      // Duration of the screen fade-out animation
      if (isAppActuallyLoaded) { // Double check app is loaded before finishing
        timer = setTimeout(() => {
          setPhase('finished');
          onLoadingFinished(); // Notify parent component
        }, 700); // Corresponds to fade-out duration in CSS
      }
    }
    return () => clearTimeout(timer);
  }, [phase, isAppActuallyLoaded, onLoadingFinished, typewriterTotalDuration]);

  // This effect handles the case where the app loads *while* the loader is still in 'fadingLoader' phase
  useEffect(() => {
    if (isAppActuallyLoaded && phase === 'fadingLoader') {
      // If app loads and we were in fadingLoader, immediately try to move to fadingScreen
      // This gives a brief moment for the loader to fade out if it hadn't started.
      const quickTransitionTimer = setTimeout(() => setPhase('fadingScreen'), 100);
      return () => clearTimeout(quickTransitionTimer);
    }
  }, [isAppActuallyLoaded, phase]);


  if (phase === 'finished') {
    return null;
  }

  const showSpinner = phase === 'typing' || (phase === 'fadingLoader' && !isAppActuallyLoaded);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out",
        phase === 'fadingScreen' ? 'opacity-0' : 'opacity-100'
      )}
      style={{ pointerEvents: phase === 'fadingScreen' ? 'none' : 'auto' }}
    >
      <div className="relative text-center" style={{ transform: 'translateY(-50px)' }}> {/* Moved logo further up */}
        <h1
          className={cn(
            "font-logo-cursive text-6xl sm:text-7xl text-primary mb-6 typewriter-text",
            phase !== 'typing' && 'typewriter-text-done' // Class to remove border after typing
          )}
          style={{
            '--char-count': appName.length,
            '--typewriter-duration': `${typewriterTotalDuration / 1000}s`,
          } as React.CSSProperties}
        >
          {appName}
        </h1>
        <div className="h-8"> {/* Container to prevent layout shift when loader fades */}
          {showSpinner && (
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto transition-opacity duration-300 opacity-100" />
          )}
          {(phase === 'fadingLoader' && isAppActuallyLoaded && !showSpinner) && (
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto transition-opacity duration-300 opacity-0" />
          )}
        </div>
      </div>
    </div>
  );
};
