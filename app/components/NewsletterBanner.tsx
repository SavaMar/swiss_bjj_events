"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

const NewsletterBanner = () => {
  const { language } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't show newsletter banner on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Don't render anything on the server side
  if (!isMounted) {
    return null;
  }

  // Newsletter text in different languages
  const translations = {
    en: {
      title: "Sign Up for Swiss BJJ Events Newsletter",
      subtitle: "Swiss BJJ news—delivered first to you.",
    },
    de: {
      title: "Abonnieren Sie den Swiss BJJ Events Newsletter",
      subtitle: "Swiss BJJ Neuigkeiten—zuerst für Sie geliefert.",
    },
    fr: {
      title: "Inscrivez-vous à la Newsletter Swiss BJJ Events",
      subtitle: "Actualités Swiss BJJ—livrées en premier pour vous.",
    },
    it: {
      title: "Iscriviti alla Newsletter Swiss BJJ Events",
      subtitle: "Notizie Swiss BJJ—consegnate prima a te.",
    },
  };

  // Get translations based on current language or fallback to English
  const currentTranslation =
    translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="bg-red-100 py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentTranslation.title}
            </h2>
            <p className="text-gray-600 mt-1">{currentTranslation.subtitle}</p>
          </div>
          <div className="w-full md:w-auto">
            <iframe
              src="https://embeds.beehiiv.com/94344114-f7f2-426e-b221-8be29c1ccc92?slim=true"
              data-test-id="beehiiv-embed"
              height="52"
              frameBorder="0"
              scrolling="no"
              style={{
                margin: 0,
                borderRadius: 0,
                backgroundColor: "transparent",
                width: "100%",
                minWidth: "280px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
