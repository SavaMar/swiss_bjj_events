"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import with no SSR
const NewsletterPopup = dynamic(() => import("./NewsletterPopup"), {
  ssr: false,
  loading: () => {
    console.log("Loading NewsletterPopup component...");
    return null;
  },
});

export default function NewsletterWrapper() {
  const [mounted, setMounted] = useState(false);
  const [showDebugIndicator, setShowDebugIndicator] = useState(true);
  const pathname = usePathname();

  // Don't show newsletter popup on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    console.log("NewsletterWrapper mounted");
    setMounted(true);

    // Hide the debug indicator after 10 seconds
    const timer = setTimeout(() => {
      setShowDebugIndicator(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Mounted state changed:", mounted);
  }, [mounted]);

  // Only render the popup on the client side
  if (!mounted) {
    console.log("Not mounted yet, returning null");
    return null;
  }

  console.log("NewsletterWrapper rendering popup component");
  return (
    <>
      {showDebugIndicator && (
        <div
          className="fixed bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-50"
          onClick={() => setShowDebugIndicator(false)}
        >
          Client-Side Active
        </div>
      )}
      <NewsletterPopup />
    </>
  );
}
