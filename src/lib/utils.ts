
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a duration in total minutes to a user-friendly "X hr Y min" string.
 * Example: 75 minutes => "1 hr 15 min"
 * Example: 120 minutes => "2 hr"
 * Example: 30 minutes => "30 min"
 * Example: 0 or invalid minutes => "0 min"
 */
export function formatMinutesToFriendlyDuration(totalMinutes: number): string {
  if (isNaN(totalMinutes) || totalMinutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  let result = "";
  if (hours > 0) {
    result += `${hours} hr`;
  }

  if (minutes > 0) {
    if (hours > 0) {
      result += " "; // Add a space if there are hours
    }
    result += `${minutes} min`;
  }
  
  return result;
}

/**
 * Formats a duration in total seconds to HH:mm:ss string format.
 * Example: 3661 seconds => "01:01:01"
 */
export function formatSecondsToHHMMSS(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00:00";
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60); // Ensure seconds is an integer
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Shows a browser notification.
 * Requests permission if not already granted or denied.
 */
export function showBrowserNotification(title: string, body: string) {
  if (!('Notification' in window)) {
    console.warn("This browser does not support desktop notification.");
    return;
  }

  const displayNotification = () => {
    // You can add options like an icon here if desired
    // const iconUrl = '/icons/icon-192x192.png'; // Example icon path
    // new Notification(title, { body, icon: iconUrl });
    new Notification(title, { body });
  };

  if (Notification.permission === "granted") {
    displayNotification();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        displayNotification();
      }
    });
  }
  // If permission is "denied", we don't do anything further.
}
