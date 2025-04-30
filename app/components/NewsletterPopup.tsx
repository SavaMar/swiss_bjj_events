"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  getStorageItem,
  setStorageItem,
  isStorageAvailable,
} from "../utils/storage";

// Set to true to force the popup to appear even if previously closed
const FORCE_POPUP_DEBUG = true;

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    console.log("NewsletterPopup mounted");

    // Check if localStorage is available
    const storageAvailable = isStorageAvailable();
    console.log("localStorage available:", storageAvailable);

    // Check if the popup has been closed previously
    let hasClosedPopup = false;
    if (storageAvailable && !FORCE_POPUP_DEBUG) {
      hasClosedPopup = getStorageItem("newsletterPopupClosed") === "true";
      console.log("Checked localStorage, hasClosedPopup:", hasClosedPopup);
    } else {
      console.log(
        "In debug mode or localStorage unavailable, showing popup anyway"
      );
    }

    if (!hasClosedPopup || FORCE_POPUP_DEBUG) {
      console.log("Scheduling popup to appear in 3 seconds");
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        console.log("Timer fired, setting popup to visible");
        setIsVisible(true);
      }, 3000);

      return () => {
        console.log("Cleaning up timer");
        clearTimeout(timer);
      };
    } else {
      console.log("Popup was previously closed, not showing");
    }
  }, []);

  const handleClose = () => {
    console.log("Close button clicked");
    setIsVisible(false);
    setClosed(true);

    // Save to localStorage to avoid showing again
    if (isStorageAvailable()) {
      setStorageItem("newsletterPopupClosed", "true");
      console.log("Saved closed state to localStorage");
    }
  };

  // Don't render anything if the popup is not visible or was closed
  if (!isVisible || closed) {
    console.log(
      "Popup not rendering, isVisible:",
      isVisible,
      "closed:",
      closed
    );
    return null;
  }

  console.log("Rendering popup");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Stay Updated with Swiss BJJ
          </h2>
          <p className="text-gray-600">
            Subscribe to our newsletter for the latest events, articles, and
            news from the Swiss BJJ community.
          </p>
        </div>

        <div className="w-full">
          <iframe
            src="https://embeds.beehiiv.com/94344114-f7f2-426e-b221-8be29c1ccc92"
            data-test-id="beehiiv-embed"
            width="100%"
            height="320"
            frameBorder="0"
            scrolling="no"
            style={{
              borderRadius: "4px",
              border: "2px solid #e5e7eb",
              margin: "0",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
