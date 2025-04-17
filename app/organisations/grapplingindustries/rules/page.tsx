"use client";

import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Markdown content for each language
const rulesContent = {
  en: `
  Comming Soon...
  `,
};

export default function GrapplingIndustriesRulesPage() {
  const { language } = useLanguage();

  // Get the content based on language, defaulting to English
  const content =
    rulesContent[language as keyof typeof rulesContent] || rulesContent.en;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/organisations"
        className="flex items-center text-blue-600 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Organizations
      </Link>

      <div className="prose max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\n/g, "<br>")
              .replace(/^#{1,6}\s+(.*?)$/gm, (match, group) => {
                const count = match.lastIndexOf("#") + 1;
                return `<h${count}>${group}</h${count}>`;
              }),
          }}
        />
      </div>
    </div>
  );
}
