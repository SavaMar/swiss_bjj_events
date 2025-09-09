"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type Language = "en" | "de" | "fr" | "it";

interface Translations {
  navigation: {
    events: string;
    dojos: string;
    organisations: string;
    articles: string;
    contact: string;
  };
  events?: {
    title: string;
    filter: {
      all: string;
      womens: string;
      "open-mat": string;
      competition: string;
      seminar: string;
      kids: string;
      camp: string;
      thisMonth: string;
      includingPastEvents: string;
      hidePastEvents: string;
      byCantonLabel: string;
      allCantons: string;
    };
    card: {
      date: string;
      registerUntil: string;
      location: string;
      registerButton: string;
      organizer: string;
      guest: string;
    };
    calendarView: string;
    addEvent: string;
    backToEvents: string;
    noEvents: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    followUs: string;
    rights: string;
  };
  organisations?: {
    title: string;
    description: string;
    visitWebsite: string;
    followInstagram: string;
    viewRules: string;
    ajp?: {
      description: string;
    };
    adcc?: {
      description: string;
    };
    sbjjnf?: {
      description: string;
    };
    grapplingindustries?: {
      description: string;
    };
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Helper function to get language from pathname
const getLanguageFromPath = (pathname: string): Language => {
  const pathSegments = pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    if (["en", "de", "fr", "it"].includes(firstSegment)) {
      return firstSegment as Language;
    }
  }
  return "en";
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const initialLanguage = getLanguageFromPath(pathname || "");

  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [translations, setTranslations] = useState<Translations>(
    {} as Translations
  );
  const [isClient, setIsClient] = useState(false);

  // Set isClient flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load initial translations immediately
  useEffect(() => {
    const loadInitialTranslations = async () => {
      try {
        console.log(`Loading initial translations for ${initialLanguage}`);
        const translations = await import(
          `../locales/${initialLanguage}/translation.json`
        );
        setTranslations(translations.default);
      } catch (error) {
        console.error(
          `Error loading initial translations for ${initialLanguage}:`,
          error
        );
        // If the requested language fails, try English
        if (initialLanguage !== "en") {
          console.log("Falling back to English translations");
          const englishTranslations = await import(
            "../locales/en/translation.json"
          );
          setTranslations(englishTranslations.default);
        }
      }
    };

    loadInitialTranslations();
  }, [initialLanguage]);

  // Effect to detect language from URL path - only run on client
  useEffect(() => {
    if (!isClient || !pathname) return;

    const newLanguage = getLanguageFromPath(pathname);
    if (language !== newLanguage) {
      console.log(`Setting language to ${newLanguage} from URL`);
      setLanguage(newLanguage);
    }
  }, [pathname, language, isClient]);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log(`Loading translations for ${language}`);
        const translations = await import(
          `../locales/${language}/translation.json`
        );
        setTranslations(translations.default);
      } catch (error) {
        console.error(`Error loading translations for ${language}:`, error);
        if (language !== "en") {
          console.log("Falling back to English translations");
          const englishTranslations = await import(
            "../locales/en/translation.json"
          );
          setTranslations(englishTranslations.default);
        }
      }
    };

    loadTranslations();
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
