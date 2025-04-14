"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "de" | "fr" | "it";

interface Translations {
  navigation: {
    events: string;
    dojos: string;
    brands: string;
    contact: string;
  };
  events: {
    title: string;
    filter: {
      all: string;
      womens: string;
      "open-mat": string;
      competition: string;
      seminar: string;
      kids: string;
    };
    card: {
      date: string;
      registerUntil: string;
      location: string;
      registerButton: string;
    };
    noEvents: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    followUs: string;
    rights: string;
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translations>(
    {} as Translations
  );

  useEffect(() => {
    // Load translations for the current language
    const loadTranslations = async () => {
      try {
        const translations = await import(
          `../locales/${language}/translation.json`
        );
        setTranslations(translations.default);
      } catch (error) {
        console.error("Error loading translations:", error);
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
