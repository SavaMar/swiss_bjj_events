"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function ArticlesRedirect() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect to the language-specific articles page
    router.replace(`/${language}/articles`);
  }, [router, language]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
