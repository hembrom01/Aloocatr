
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
  
  // If hours and minutes are both 0 but totalMinutes was > 0 (e.g. due to rounding if it was < 1 min, though our input is usually whole minutes)
  // the initial check for totalMinutes <= 0 handles the "0 min" case.
  // If result is still empty here (e.g. totalMinutes was a fraction of a minute and became 0hr 0min), it would be caught by the initial check.
  // This logic ensures "0 min" for zero or negative, "X hr" if only hours, "Y min" if only minutes, and "X hr Y min" if both.

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

