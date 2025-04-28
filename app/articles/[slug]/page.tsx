"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";

export default function ArticleRedirect() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect to the language-specific article page
    router.replace(`/${language}/articles/${slug}`);
  }, [router, language, slug]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
