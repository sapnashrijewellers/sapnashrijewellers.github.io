"use client";
import { useEffect } from "react";

export default function BadgeHandler() {
  useEffect(() => {
    // Clear the badge when the user opens the app
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch((error) => {
        console.error("Error clearing badge:", error);
      });
    }
  }, []);

  return null; // This component doesn't render anything
}