"use client";

import React from "react";
import Image from "next/image";
import { Dojo, DOJO_FEATURE_COLORS } from "../types/dojo";
import { SWISS_CANTON_NAMES } from "../types/event";
import { ExternalLink, MapPin, Award, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface DojoCardProps {
  dojo: Dojo;
}

export default function DojoCard({ dojo }: DojoCardProps) {
  const { translations, language } = useLanguage();

  // Handle image errors by providing a fallback
  const fallbackImageUrl = "/placeholder.jpg";

  // Base URL for all dojo logos
  const logoBaseUrl = "https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/";

  // Construct the full logo URL
  const getLogoUrl = (filename: string): string => {
    if (!filename) return fallbackImageUrl;
    return `${logoBaseUrl}${filename}`;
  };

  // Helper to safely handle dojo.extra which might be a string, array, or other format
  const formatExtra = (extra: unknown): string => {
    if (!extra) return "";

    if (Array.isArray(extra)) {
      return extra.map((item) => String(item).replace(/_/g, " ")).join(", ");
    }

    if (typeof extra === "string") {
      // Handle "{item1, item2}" format
      const cleanedString = extra.replace(/[{}]/g, "");
      return cleanedString
        .split(",")
        .map((item) => item.trim().replace(/_/g, " "))
        .join(", ");
    }

    // If it's another type, convert to string and clean it
    return String(extra).replace(/[{}]/g, "").replace(/_/g, " ");
  };

  // Simple function to translate "one week" only
  const getTrialText = (trial: string): string => {
    if (!trial) return "";

    // Only translate "one week" - everything else remains as is
    if (trial.toLowerCase() === "one week") {
      // Simple mapping for "one week" in different languages
      const oneWeekTranslations: Record<string, string> = {
        en: "one week",
        de: "eine Woche",
        fr: "une semaine",
        it: "una settimana",
      };

      return oneWeekTranslations[language] || "one week";
    }

    // Return all other trial periods as-is
    return trial;
  };

  return (
    <div className="relative rounded-lg shadow-md overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow duration-300 h-full">
      {/* Dojo logo - Enhanced for consistency */}
      <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="w-4/5 h-4/5 relative flex items-center justify-center">
          {dojo.logo ? (
            <Image
              src={getLogoUrl(dojo.logo)}
              alt={dojo.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImageUrl;
              }}
            />
          ) : (
            <div className="text-gray-400">No image available</div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold mb-2">{dojo.name}</h3>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {dojo.is_womans && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${DOJO_FEATURE_COLORS.womans}`}
            >
              {translations?.dojos?.features?.womans || "Women's Classes"}
            </span>
          )}
          {dojo.is_kids && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${DOJO_FEATURE_COLORS.kids}`}
            >
              {translations?.dojos?.features?.kids || "Kids Classes"}
            </span>
          )}
          {dojo.is_advanced && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${DOJO_FEATURE_COLORS.advanced}`}
            >
              {translations?.dojos?.features?.advanced || "Advanced Training"}
            </span>
          )}
          {dojo.is_open_mat && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${DOJO_FEATURE_COLORS.open_mat}`}
            >
              {translations?.dojos?.features?.open_mat || "Open Mat"}
            </span>
          )}
          {dojo.free_guest && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${DOJO_FEATURE_COLORS.free_guest}`}
            >
              {translations?.dojos?.features?.free_guest ||
                "Free Guest Training"}
            </span>
          )}
        </div>

        {/* Location information */}
        <div className="flex items-start gap-2 mb-2 text-gray-600">
          <MapPin size={16} className="mt-1 flex-shrink-0" />
          <div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                dojo.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {dojo.address}
            </a>
          </div>
        </div>

        {/* Trial offer if available */}
        {dojo.trial && (
          <div className="flex items-start gap-2 mb-2 text-gray-600">
            <Award size={16} className="mt-1 flex-shrink-0" />
            <p>
              {translations?.dojos?.trial || "Trial Offer"}:{" "}
              {getTrialText(dojo.trial)}
            </p>
          </div>
        )}

        {/* Extra offerings */}
        {dojo.extra && (
          <div className="flex items-start gap-2 mb-4 text-gray-600">
            <Users size={16} className="mt-1 flex-shrink-0" />
            <div>
              <p>
                {translations?.dojos?.also_offers || "Also offers"}:{" "}
                {formatExtra(dojo.extra)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-4 pt-0 mt-auto">
        <div className="flex flex-col space-y-2">
          {dojo.website && (
            <a
              href={dojo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
            >
              {translations?.dojos?.visitWebsite || "Visit Website"}{" "}
              <ExternalLink size={14} className="ml-1" />
            </a>
          )}

          {dojo.instagram && (
            <a
              href={dojo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300 text-sm font-medium"
            >
              Instagram <ExternalLink size={14} className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
