"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "de" | "fr" | "it";

interface Translations {
  navigation: {
    events: string;
    dojos: string;
    brands: string;
    contact: string;
    organisations: string;
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
      pastEventButton?: string;
    };
    noEvents: string;
  };
  organisations?: {
    title: string;
    description: string;
    visitWebsite: string;
    followInstagram: string;
    viewRules: string;
    ajp: {
      description: string;
    };
    adcc: {
      description: string;
    };
    sbjjnf: {
      description: string;
    };
    grapplingindustries: {
      description: string;
    };
  };
  contact: {
    title: string;
    intro: string;
    bulletPoints: string[];
    formIntro: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    submitButton: string;
  };
  dojos: {
    title: string;
    explanation: {
      title: string;
      womans: string;
      kids: string;
      advanced: string;
      open_mat: string;
      free_guest: string;
    };
    filter: {
      byCantonLabel: string;
      byZipCodeLabel: string;
      byFeaturesLabel: string;
      allCantons: string;
      allZipCodes: string;
      clearFilters: string;
    };
    features: {
      womans: string;
      kids: string;
      advanced: string;
      open_mat: string;
      free_guest: string;
    };
    trial: string;
    also_offers: string;
    visitWebsite: string;
    noDojos: string;
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
