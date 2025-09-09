"use client";

import React from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { fetchRuleBySlug } from "../../../../lib/organisations";
import MarkdownRenderer from "../../../../components/MarkdownRenderer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SJJARulesPage() {
  const { language, translations } = useLanguage();
  const [rule, setRule] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadRule() {
      try {
        setLoading(true);
        const ruleData = await fetchRuleBySlug("sjja-rules", language);
        setRule(ruleData);
      } catch (err) {
        console.error("Error loading SJJA rules:", err);
        setError("Failed to load rules");
      } finally {
        setLoading(false);
      }
    }

    loadRule();
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link
            href={`/${language}/organisations`}
            className="text-blue-600 flex items-center"
          >
            <ChevronLeft size={20} />
            <span>
              {translations?.organisations?.backToOrganisations ||
                "Back to Organizations"}
            </span>
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || "Rules not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link
          href={`/${language}/organisations`}
          className="text-blue-600 flex items-center"
        >
          <ChevronLeft size={20} />
          <span>
            {translations?.organisations?.backToOrganisations ||
              "Back to Organizations"}
          </span>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            {rule.title || "SJJA Competition Rules"}
          </h1>
          <p className="text-gray-600 mt-2">
            {rule.excerpt ||
              "Competition rules and regulations for SJJA events"}
          </p>
        </div>

        <div className="px-6 py-8">
          {rule.content ? (
            <MarkdownRenderer content={rule.content} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {translations?.organisations?.rulesNotAvailable ||
                  "Rules are not yet available for this organization."}
              </p>
              <p className="text-gray-400 mt-2">
                {translations?.organisations?.checkBackLater ||
                  "Please check back later or contact the organization directly."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
